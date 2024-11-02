import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MedicationSlotService {
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

  async create(
    createMedicationSlotDto: Prisma.MedicationSlotCreateInput,
    parentId: number,
    childId: number
  ) {
    await this.verifyParentChildRelation(parentId, childId);

    if (!createMedicationSlotDto.medication || !createMedicationSlotDto.medication.connect) {
      throw new BadRequestException("Missing required field 'medication'");
    }

    const medication = await this.databaseService.medication.findUnique({
      where: {
        id: createMedicationSlotDto.medication.connect.id,
        isDeleted: false,
        childId: childId,
      },
    });

    if (!medication) {
      throw new NotFoundException("Medication not found");
    }

    if (!createMedicationSlotDto.status || !['taken', 'missed'].includes(createMedicationSlotDto.status)) {
      throw new BadRequestException("Invalid status value. Accepted values are 'taken' or 'missed'");
    }

    if (createMedicationSlotDto.time && isNaN(Date.parse(createMedicationSlotDto.time.toString()))) {
      throw new BadRequestException("Invalid time format, expected ISO-8601 DateTime");
    }

    if (createMedicationSlotDto.amount === undefined || createMedicationSlotDto.amount <= 0) {
      throw new BadRequestException("Amount should be a positive number");
    }

    createMedicationSlotDto.isDeleted = false;

    return this.databaseService.medicationSlot.create({
      data: createMedicationSlotDto,
    });
  }

  async findAll(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);
    return this.databaseService.medicationSlot.findMany({
      where: {
        medication: {
          childId: childId,
          isDeleted: false
        }
      }
    })
  }

  async findOne(id: number, parentId: number) {
    const record = await this.databaseService.medicationSlot.findUnique({
      where: {
        medicationSlotId: id,
        isDeleted: false
      },
      include: {
        medication: true
      }
    })
    if (!record) { throw new NotFoundException }
    await this.verifyParentChildRelation(parentId, record.medication.childId);
    return record
  }

  async update(id: number, parentId: number, updateMedicationSlotDto: Prisma.MedicationSlotUpdateInput) {

    const record = await this.databaseService.medicationSlot.findUnique({
      where: {
        medicationSlotId: id,
        isDeleted: false,
      },
      include: {
        medication: true,
      },
    });

    if (!record) throw new NotFoundException('Medication slot not found');

    await this.verifyParentChildRelation(parentId, record.medication.childId);

    if ('isDeleted' in updateMedicationSlotDto) {
      throw new BadRequestException("Cannot update 'isDeleted' field");
    }

    if (updateMedicationSlotDto.status && !['taken', 'missed'].includes(updateMedicationSlotDto.status as string)) {
      throw new BadRequestException("Invalid status value. Accepted values are 'taken' or 'missed'");
    }

    if (updateMedicationSlotDto.time && isNaN(Date.parse(updateMedicationSlotDto.time.toString()))) {
      throw new BadRequestException("Invalid time format, expected ISO-8601 DateTime");
    }

    return await this.databaseService.medicationSlot.update({
      where: { medicationSlotId: id },
      data: updateMedicationSlotDto,
    });
  }

  async remove(id: number, parentId: number) {
    const medicationSlot = await this.databaseService.medicationSlot.findUnique({
      where: {
        medicationSlotId: id,
        isDeleted: false
      },
      include: {
        medication: true,
      },
    });

    if (!medicationSlot || medicationSlot.isDeleted) {
      throw new NotFoundException('Medication slot not Found');
    }

    await this.verifyParentChildRelation(parentId, medicationSlot.medication.childId);

    return await this.databaseService.medicationSlot.update({
      where: {
        medicationSlotId: id,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}
