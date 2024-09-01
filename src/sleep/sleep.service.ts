import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class SleepService {

constructor(private readonly databaseService : DatabaseService){}

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

  async create(createSleepDto: Prisma.SleepCreateInput, parentId: number) {

    await this.verifyParentChildRelation(parentId, createSleepDto.child.connect.childId);


    return this.databaseService.sleep.create({
      data: {
        date: createSleepDto.date,
        startTime: createSleepDto.startTime,
        duration: createSleepDto.duration,
        note: createSleepDto.note,
        sleepStyle: createSleepDto.sleepStyle,
        child: {
          connect: { childId: createSleepDto.child.connect.childId },
        },
      },
    });
  }

  async getSleepRecordsBetweenDates(parentId: number, childId: number, startDate: Date, endDate: Date) {
    await this.verifyParentChildRelation(parentId, childId);

    return this.databaseService.sleep.findMany({
      where: {
        childId: childId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async findAll(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);

    return this.databaseService.sleep.findMany({
      where: {
        childId: childId,
      },
    });
  }

  async updateSleepRecord(parentId: number, sleepId: number, updateSleepDto: Prisma.SleepUpdateInput) {
    const sleepRecord = await this.databaseService.sleep.findUnique({
      where: { sleepId: sleepId },
    });

    if (!sleepRecord) {
      throw new NotFoundException(`Sleep record with ID ${sleepId} not found.`);
    }

    await this.verifyParentChildRelation(parentId, sleepRecord.childId);

    return this.databaseService.sleep.update({
      where: { sleepId: sleepId },
      data: updateSleepDto,
    });
  }

  async deleteSleepRecord(parentId: number, sleepId: number) {
    const sleepRecord = await this.databaseService.sleep.findUnique({
      where: { sleepId: sleepId },
    });

    if (!sleepRecord) {
      throw new NotFoundException(`Sleep record with ID ${sleepId} not found.`);
    }

    await this.verifyParentChildRelation(parentId, sleepRecord.childId);

    return this.databaseService.sleep.delete({
      where: { sleepId: sleepId },
    });
  }
}