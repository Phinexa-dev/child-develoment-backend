import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VaccinationService {
  constructor(private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService) { }

  private async verifyParentChildRelation(parentId: number, childId: number) {
    const parentChildRelation = await this.databaseService.parentChild.findFirst({
      where: {
        parentId: parentId,
        childId: childId,
        status: 'Active',
      },
    });
    if (!parentChildRelation) {
      throw new UnauthorizedException('This child does not belong to the authenticated parent.');
    }
  }

  async create(createVaccinationDto: CreateVaccinationDto, parentId: number) {
    const { symptomIds, childId, vaccineId, images, ...vaccinationData } = createVaccinationDto;

    await this.verifyParentChildRelation(parentId, childId);

    const childConnection = {
      connect: { childId: childId },
    };

    const child = await this.databaseService.child.findUnique({
      where: { childId: childId },
      select: { region: true },
    });

    const vaccine = await this.databaseService.vaccine.findUnique({
      where: {
        id: vaccineId,
        isDeleted: false,
        region: { equals: child?.region, mode: 'insensitive' },
      },
    });

    if (!vaccine) {
      throw new NotFoundException('Vaccine not found or does not match child’s region');
    }

    const vaccineConnection = vaccineId ? { connect: { id: vaccineId } } : undefined;

    let symptomConnections;
    if (symptomIds && symptomIds.length > 0) {
      const existingSymptoms = await this.databaseService.symptom.findMany({
        where: { id: { in: symptomIds }, isDeleted: false },
        select: { id: true },
      });

      const existingSymptomIds = existingSymptoms.map(symptom => symptom.id);
      const missingIds = symptomIds.filter(id => !existingSymptomIds.includes(id));

      if (missingIds.length > 0) {
        throw new NotFoundException(`Symptoms with IDs ${missingIds.join(', ')} do not exist.`);
      }

      symptomConnections = {
        create: symptomIds.map(id => ({
          symptom: { connect: { id } },
        })),
      };
    }

    const imageConnections = images
      ? images.map(url => ({
        image: url,
      }))
      : [];

    const data: Prisma.VaccinationCreateInput = {
      ...vaccinationData,
      child: childConnection,
      vaccine: vaccineConnection,
      symptoms: symptomConnections,
      images: {
        create: imageConnections,
      },
    };

    return this.databaseService.vaccination.create({ data });
  }


  async findAll(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);

    const vaccinations = await this.databaseService.vaccination.findMany({
      where: {
        childId,
        isDeleted: false,
      },
      select: {
        id: true,
        childId: true,
        vaccineId: true,
        status: true,
        date: true,
        venue: true,
        notes: true,
        country: true,
        symptoms: {
          where: {
            isDeleted: false,
          },
          select: {
            symptom: {
              select: {
                id: true,
              },
            },
          },
        },
        images: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
            image: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    const baseUrl = this.configService.getOrThrow('ENV_UPLOADS')

    return vaccinations.map(vaccination => ({
      ...vaccination,
      symptoms: vaccination.symptoms.map(s => s.symptom.id),
      images: vaccination.images.map(image => ({
        ...image,
        image: `${baseUrl}/${image.image}`,
      })),
    }));
  }


  findOne(id: number) {
    return `This action returns a #${id} vaccination`;
  }

  async update(id: number, updateVaccinationDto: UpdateVaccinationDto, parentId: number) {
    const { symptomIds, images = [], ...vaccinationData } = updateVaccinationDto;

    const existingVaccination = await this.databaseService.vaccination.findUnique({
      where: { id },
      include: {
        child: true,
        symptoms: {
          where: {
            isDeleted: false
          },
          select: { symptomId: true, id: true }
        },
        images: { select: { id: true, image: true, isDeleted: true } },
      },
    });

    if (!existingVaccination || existingVaccination.isDeleted) {
      throw new NotFoundException(`Vaccination with ID ${id} not found`);
    }

    await this.verifyParentChildRelation(parentId, existingVaccination.childId);

    if (symptomIds) {

      const symptomIdsInt = symptomIds.map(id => {
        const parsedId = parseInt(id as any, 10); // Explicit conversion
        if (isNaN(parsedId)) {
          throw new BadRequestException(`Invalid symptom ID: ${id}`);
        }
        return parsedId;
      });

      const existingSymptomIds = existingVaccination.symptoms.map(s => s.symptomId);
      const symptomsToDelete = existingSymptomIds.filter(id => !symptomIdsInt.includes(id));
      const symptomsToAdd = symptomIdsInt.filter(id => !existingSymptomIds.includes(id));

      await this.databaseService.postSymptom.updateMany({
        where: {
          vaccinationId: id,
          symptomId: { in: symptomsToDelete },
        },
        data: { isDeleted: true },
      });

      await Promise.all(
        symptomsToAdd.map(symptomId =>
          this.databaseService.postSymptom.create({
            data: {
              vaccinationId: id,
              symptomId,
            },
          }),
        ),
      );
    } else if (symptomIds && symptomIds.length === 0) {
      await this.databaseService.postSymptom.updateMany({
        where: { vaccinationId: id },
        data: { isDeleted: true },
      });
    }
    console.log(images)
    if (images.length > 0) {
      const existingImages = existingVaccination.images.filter(img => !img.isDeleted).map(img => img.image);
      const imagesToDelete = existingImages.filter(image => !images.includes(image));
      const imagesToAdd = images.filter(image => !existingImages.includes(image));

      await this.databaseService.vaccinationImages.updateMany({
        where: {
          vaccinationId: id,
          image: { in: imagesToDelete },
        },
        data: { isDeleted: true },
      });

      await Promise.all(
        imagesToAdd.map(image =>
          this.databaseService.vaccinationImages.create({
            data: {
              vaccinationId: id,
              image,
            },
          }),
        ),
      );

    } else if (images && images.length === 0) {
      await this.databaseService.vaccinationImages.updateMany({
        where: { vaccinationId: id },
        data: { isDeleted: true },
      });
    }

    const updatedVaccination = await this.databaseService.vaccination.update({
      where: { id },
      data: vaccinationData,
      include: {
        symptoms: {
          where: { isDeleted: false },
          select: {
            symptom: {
              select: {
                id: true,
              },
            },
          },
        },
        images: {
          where: { isDeleted: false },
          select: {
            id: true,
            image: true,
          },
        },
      },
    });

    const baseUrl = this.configService.getOrThrow('ENV_UPLOADS')

    return {
      ...updatedVaccination,
      symptoms: updatedVaccination.symptoms.map(s => s.symptom.id),
      images: updatedVaccination.images.map(image => ({
        ...image,
        image: `${baseUrl}/${image.image}`, // Prepend base URL to image path
      })),
    };
  }


  async remove(id: number, parentId: number) {
    const vaccination = await this.databaseService.vaccination.findUnique({ where: { id, isDeleted: false } });
    if (!vaccination) {
      throw new NotFoundException(`Vaccination with ID ${id} not found`);
    }
    this.verifyParentChildRelation(parentId, vaccination.childId);
    return this.databaseService.vaccination.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
