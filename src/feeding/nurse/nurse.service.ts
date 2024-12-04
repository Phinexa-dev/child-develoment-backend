import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateNurseDto } from './dto/create-nurse-dto';
import { UpdateNurseDto } from './dto/update-nurse-dto';
import { subMonths } from 'date-fns';

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

  async create(createNurseDto: CreateNurseDto, parentId: number) {
    try {
      await this.verifyParentChildRelation(parentId, createNurseDto.childId);

      if (!createNurseDto.leftDuration && !createNurseDto.rightDuration && !createNurseDto.notes) {
        throw new BadRequestException(
          "At least one of 'leftDuration', 'rightDuration', or 'notes' must be provided",
        );
      }

      const nursingData: Prisma.NursingCreateInput = {
        startingTime: createNurseDto.startingTime,
        endingTime: createNurseDto.endingTime,
        leftDuration: createNurseDto.leftDuration,
        rightDuration: createNurseDto.rightDuration,
        notes: createNurseDto.notes,
        child: {
          connect: { childId: createNurseDto.childId },
        },
      };

      return this.databaseService.nursing.create({
        data: nursingData,
      });
    } catch (e) {
      throw new BadRequestException(e.message || e);
    }
  }

  async findAll(parentId: number, childId: number, limit: number, offset: number) {
    try {
      await this.verifyParentChildRelation(parentId, childId);

      return this.databaseService.nursing.findMany({
        where: {
          childId: childId,
          isDeleted: false,
        },
        select: {
          id: true,
          childId: true,
          startingTime: true,
          endingTime: true,
          leftDuration: true,
          rightDuration: true,
          notes: true,
        },
        take: limit,
        skip: offset,
        orderBy: { startingTime: 'desc' }
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
          isDeleted: false,
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

  async update(id: number, updateNurseDto: UpdateNurseDto, parentId: number) {
    try {
      const nursingRecord = await this.databaseService.nursing.findUnique({
        where: {
          id: id,
          isDeleted: false,
        },
      });

      if (!nursingRecord) {
        throw new NotFoundException('Nursing record not found');
      }

      await this.verifyParentChildRelation(parentId, nursingRecord.childId);

      return this.databaseService.nursing.update({
        where: { id: id },
        data: {
          ...updateNurseDto
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
        startingTime: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async remove(id: number, parentId: number) {
    try {
      const nursingRecord = await this.databaseService.nursing.findUnique({
        where: {
          id: id,
          isDeleted: false
        },
      });

      if (!nursingRecord) {
        throw new NotFoundException('Nursing record not found');
      }
      await this.verifyParentChildRelation(parentId, nursingRecord.childId);

      return this.databaseService.nursing.update({
        where: { id: id },
        data: { isDeleted: true }
      });
    } catch (e) {
      throw new BadRequestException(e.message || e);
    }
  }

  async summary(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);

    const records = await this.databaseService.nursing.findMany({
      where: {
        childId: childId,
        isDeleted: false,
      },
      select: {
        startingTime: true,
        leftDuration: true,
        rightDuration: true,
      },
      orderBy: {
        startingTime: 'asc',
      },
      take: 20,
    });

    if (records.length === 0) {
      throw new NotFoundException('No nursing records found for this child.');
    }

    const durations = records.map(record => (record.leftDuration || 0) + (record.rightDuration || 0));
    const endingDate = records[records.length - 1].startingTime.toISOString().split('T')[0];
    const startingDate = records[0].startingTime.toISOString().split('T')[0];
    const minimumDuration = Math.min(...durations);
    const maximumDuration = Math.max(...durations);
    const averageDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;

    return {
      startingDate,
      endingDate,
      minimumDuration,
      maximumDuration,
      averageDuration: parseFloat(averageDuration.toFixed(2)),
    };
  }
}
