import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class NurseService {

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

  async create(createNurseDto: Prisma.NursingCreateInput, parentId: number) {
    try {
      await this.verifyParentChildRelation(parentId, createNurseDto.child.connect.childId);

      if (!createNurseDto.date || !createNurseDto.time) {
        throw new BadRequestException("Time and Date should be included");
      }
      if (isNaN(Date.parse(createNurseDto.date.toString()))) {
        throw new BadRequestException("Invalid date format, expected ISO-8601 DateTime");
      }
      if (isNaN(Date.parse(createNurseDto.time.toString()))) {
        throw new BadRequestException("Invalid time format, expected ISO-8601 DateTime");
      }
      if (!createNurseDto.leftDuration && !createNurseDto.rightDuration && !createNurseDto.notes) {
        throw new BadRequestException("Body should contain at least one of left, right durations or note")
      }

      return this.databaseService.nursing.create({
        data: {
          date: createNurseDto.date,
          time: createNurseDto.time,
          leftDuration: createNurseDto.leftDuration,
          rightDuration: createNurseDto.rightDuration,
          notes: createNurseDto.notes,
          child: {
            connect: { childId: createNurseDto.child.connect.childId },
          },
        },
      });
    } catch (e) {
      throw new BadRequestException(e.message || e);
    }
  }

  async findAll(parentId: number, childId: number) {
    try {

      await this.verifyParentChildRelation(parentId, childId)
      return this.databaseService.nursing.findMany({
        where: {
          childId: childId
        }

      });
    } catch (e) {
      throw new BadRequestException(e.message || e);
    }
  }

  async findOne(id: number, parentId: number) {
    try {
      const nursingRecord = await this.databaseService.nursing.findUnique({
        where: {
          id: id,
        },
      });

      if (!nursingRecord) {
        throw new NotFoundException('Nursing record not found');
      }
      await this.verifyParentChildRelation(parentId, nursingRecord.childId);

      return nursingRecord;
    } catch (e) {
      throw new BadRequestException(e.message || e);
    }
  }

  async update(id: number, updateNurseDto: Prisma.NursingUpdateInput, parentId: number) {
    try {
      const nursingRecord = await this.databaseService.nursing.findUnique({
        where: { id: id },
      });

      if (!nursingRecord) {
        throw new NotFoundException('Nursing record not found');
      }
      await this.verifyParentChildRelation(parentId, nursingRecord.childId);

      return this.databaseService.nursing.update({
        where: { id: id },
        data: {
          date: updateNurseDto.date ?? nursingRecord.date,
          time: updateNurseDto.time ?? nursingRecord.time,
          leftDuration: updateNurseDto.leftDuration ?? nursingRecord.leftDuration,
          rightDuration: updateNurseDto.rightDuration ?? nursingRecord.rightDuration,
          notes: updateNurseDto.notes ?? nursingRecord.notes,
          child: {
            connect: { childId: updateNurseDto.child?.connect?.childId || nursingRecord.childId },
          },
        },
      });
    } catch (e) {
      throw new BadRequestException(e.message || e);
    }
  }

  async getNurseRecordsBetweenDates(parentId: number, childId: number, startDate: Date, endDate: Date) {
    await this.verifyParentChildRelation(parentId, childId);

    return this.databaseService.nursing.findMany({
      where: {
        childId: childId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async remove(id: number, parentId: number) {
    try {
      const nursingRecord = await this.databaseService.nursing.findUnique({
        where: { id: id },
      });

      if (!nursingRecord) {
        throw new NotFoundException('Nursing record not found');
      }
      await this.verifyParentChildRelation(parentId, nursingRecord.childId);

      return this.databaseService.nursing.delete({
        where: { id: id },
      });
    } catch (e) {
      throw new BadRequestException(e.message || e);
    }
  }
}
