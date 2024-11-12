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
    const { symptomIds, childId, vaccineId, ...vaccinationData } = createVaccinationDto;
    this.verifyParentChildRelation(parentId, createVaccinationDto.childId)

    const childConnection = {
      connect: { childId: childId },
    };
    const child = await this.databaseService.child.findUnique({
      where: {
        childId: childId
      },
      select: { region: true }
    })

    const vaccine = await this.databaseService.vaccine.findUnique({
      where: {
        id: vaccineId,
        isDeleted: false,
        region: {
          equals: child.region,
          mode: 'insensitive'
        }
      }
    })
    if (!vaccine) {
      throw new NotFoundException('vaccine not found');
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
        connect: symptomIds.map(id => ({ id })),
      };
    }

    const data: Prisma.VaccinationCreateInput = {
      ...vaccinationData,
      child: childConnection,
      vaccine: vaccineConnection,
      symptoms: symptomConnections,
    };

    return this.databaseService.vaccination.create({ data });
  }

  async findAll(parentId: number, childId: number) {
    return this.databaseService.vaccination.findMany({
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
    const { symptomIds, ...vaccinationData } = updateVaccinationDto;
  
    // Verify if the vaccination exists and is not deleted
    const existingVaccination = await this.databaseService.vaccination.findUnique({
      where: { id },
      include: { child: true },
    });
  
    if (!existingVaccination || existingVaccination.isDeleted) {
      throw new NotFoundException(`Vaccination with ID ${id} not found`);
    }

    await this.verifyParentChildRelation(parentId, existingVaccination.childId);

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
        set: symptomIds.map(id => ({ id })),
      };
    }
    const data: Prisma.VaccinationUpdateInput = {
      ...vaccinationData,
      symptoms: symptomConnections,
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
4