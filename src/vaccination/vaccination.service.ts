import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VaccinationService {
  constructor(private readonly databaseService: DatabaseService) { }

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
    await this.verifyParentChildRelation(parentId, childId)
    return await this.databaseService.vaccination.findMany({
      where: {
        childId,
        isDeleted: false
      },
      include: { symptoms: { include: { symptom: true } } },
      orderBy: {
        date: 'asc'
      }
    });
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
        symptoms: { select: { symptomId: true, id: true } },
        images: { select: { id: true, image: true, isDeleted: true } },
      },
    });
  
    if (!existingVaccination || existingVaccination.isDeleted) {
      throw new NotFoundException(`Vaccination with ID ${id} not found`);
    }
  
    await this.verifyParentChildRelation(parentId, existingVaccination.childId);
  
    if (symptomIds && symptomIds.length > 0) {
      const existingSymptomIds = existingVaccination.symptoms.map(s => s.symptomId);
      const symptomsToDelete = existingSymptomIds.filter(id => !symptomIds.includes(id));
      const symptomsToAdd = symptomIds.filter(id => !existingSymptomIds.includes(id));
  
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
              symptomId: symptomId,
            },
          })
        )
      );
    } else if (symptomIds && symptomIds.length === 0) {
      await this.databaseService.postSymptom.updateMany({
        where: { vaccinationId: id },
        data: { isDeleted: true },
      });
    }
  
    if (images.length > 0) {
      const existingImageUrls = existingVaccination.images
        .filter(img => !img.isDeleted)
        .map(img => img.image);
      const imagesToDelete = existingImageUrls.filter(url => !images.includes(url));
      const imagesToAdd = images.filter(url => !existingImageUrls.includes(url));
  
      await this.databaseService.vaccinationImages.updateMany({
        where: {
          vaccinationId: id,
          image: { in: imagesToDelete },
        },
        data: { isDeleted: true },
      });
  
      await Promise.all(
        imagesToAdd.map(url =>
          this.databaseService.vaccinationImages.create({
            data: {
              vaccinationId: id,
              image: url,
            },
          })
        )
      );
    } else if (images && images.length === 0) {
      await this.databaseService.vaccinationImages.updateMany({
        where: { vaccinationId: id },
        data: { isDeleted: true },
      });
    }
  
    const data: Prisma.VaccinationUpdateInput = {
      ...vaccinationData,
    };
  
    return this.databaseService.vaccination.update({
      where: { id },
      data,
    });
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
