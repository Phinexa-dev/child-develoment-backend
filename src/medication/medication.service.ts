import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MedicationService {

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

  async create(createMedicationDto: Prisma.MedicationCreateInput, parentId: number) {

    await this.verifyParentChildRelation(parentId, createMedicationDto.child.connect.childId);

    if (!createMedicationDto.startDate || !createMedicationDto.endDate) {
      throw new BadRequestException("starting and endging Date should be included");
    }
    if (isNaN(Date.parse(createMedicationDto.startDate.toString()))) {
      throw new BadRequestException("Invalid date format, expected ISO-8601 DateTime");
    }
    if (isNaN(Date.parse(createMedicationDto.endDate.toString()))) {
      throw new BadRequestException("Invalid date format, expected ISO-8601 DateTime");
    }
    if (!createMedicationDto.frequency) {
      throw new BadRequestException("frequency is missing")
    }
    if (!createMedicationDto.medicine || !createMedicationDto.medicine.connect) {
      throw new BadRequestException("medicine is required")
    }
    const medicine = await this.databaseService.medicine.findFirst({
      where: {
        medID: createMedicationDto.medicine.connect.medID,
        AND: [
          {
            OR: [
              {
                medicationCus: {
                  some: {
                    parentId: parentId, 
                    isDeleted: false
                  },
                },
              },
              {
                medicationDefs: {
                  some: {
                    medID: createMedicationDto.medicine.connect.medID,
                    isDeleted: false
                  }, 
                },
              },
            ],
          },
        ],
      },
    });
    if(!medicine){
      throw new NotFoundException("Medicine Not Found");
    }
    createMedicationDto.isDeleted = false;
    return await this.databaseService.medication.create({
      data: createMedicationDto
    })
  }

  async findAll(parentId: number, childId: number) {

    await this.verifyParentChildRelation(parentId, childId);

    // Fetch medications and their slots
    const medications = await this.databaseService.medication.findMany({
      where: {
        childId: childId,
        isDeleted: false,
      },
      include: { timesOfDays: { 
        orderBy: { medicationSlotId: 'asc' }  // Ordering MedicationSlot by ID in ascending order
      }}
      // include: { timesOfDays: true }, // Include MedicationSlot data
    });

    // Transform data into required response format
    const response = medications.flatMap((med) =>
      med.timesOfDays.map((slot) => ({
        id: slot.medicationSlotId,
        medicineId: med.medicineId,
        frequency: med.frequency,
        note: med.note || '',
        date: slot.date,
        status: slot.status || 'not_taken',
        timeOfDay: slot.timeOfDay,
        amount: slot.amount,
      }))
    );

    return response;

    // await this.verifyParentChildRelation(parentId, childId);

    // return this.databaseService.medication.findMany({
    //   where: {
    //     childId: childId,
    //     isDeleted: false,
    //   },
    //   include: { medicine: true }
    // });
  }

  async findOne(id: number, parentId: number) {

    const medication = await this.databaseService.medication.findUnique({
      where: { id: id, isDeleted: false, },
      include: { medicine: true }
    });

    if (!medication) {
      throw new NotFoundException('Medication record not found');
    }
    await this.verifyParentChildRelation(parentId, medication.childId);

    return medication;
  }

  async update(id: number, updateMedicationDto: Prisma.MedicationUpdateInput, parentId: number) {

    const medication = await this.databaseService.medication.findUnique({
      where: { id: id, isDeleted: false },
    });

    if (!medication) {
      throw new NotFoundException('Medication record not found');
    }
    await this.verifyParentChildRelation(parentId, medication.childId);

    if (updateMedicationDto.isDeleted !== undefined) {
      throw new BadRequestException("Cannot update the isDeleted field");
    }

    return this.databaseService.medication.update({
      where: { id: id },
      data: updateMedicationDto,
    });
  }

  async remove(id: number, parentId: number) {
    const medication = await this.databaseService.medication.findUnique({
      where: { id: id, isDeleted: false },
    });

    if (!medication) {
      throw new NotFoundException('Medication record not found');
    }
    await this.verifyParentChildRelation(parentId, medication.childId);

    return this.databaseService.medication.update({
      where: { id: id },
      data: { isDeleted: true },
    });
  }

}
