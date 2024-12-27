import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isDataURI } from 'class-validator';
import { off } from 'process';
import { DatabaseService } from 'src/database/database.service';
import { CreateSleepDto } from './dto/create-sleep-dto';


@Injectable()
export class SleepService {

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

  async create(createSleepDto: CreateSleepDto, parentId: number) {

    await this.verifyParentChildRelation(parentId, createSleepDto.childId);

    return this.databaseService.sleep.create({
      data: {
        date: createSleepDto.date,
        startTime: createSleepDto.startTime,
        duration: createSleepDto.duration,
        note: createSleepDto.note,
        sleepStyle: createSleepDto.sleepStyle,
        child: {
          connect: { childId: createSleepDto.childId },
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
        isDeleted: false
      },
    });
  }

  async findAll(parentId: number, childId: number, limit: number, offset: number) {
    await this.verifyParentChildRelation(parentId, childId);

    return this.databaseService.sleep.findMany({
      where: {
        childId: childId,
        isDeleted: false
      },
      select: {
        sleepId: true,
        childId: true,
        date: true,
        startTime: true,
        duration: true,
        note: true,
        sleepStyle: true,
      },
      take: limit,
      skip: offset
    });
  }

  async updateSleepRecord(parentId: number, sleepId: number, updateSleepDto: Prisma.SleepUpdateInput) {
    const sleepRecord = await this.databaseService.sleep.findUnique({
      where: {
        sleepId: sleepId,
        isDeleted: false
      },
    });

    if (!sleepRecord) {
      throw new NotFoundException(`Sleep record with ID ${sleepId} not found.`);
    }

    await this.verifyParentChildRelation(parentId, sleepRecord.childId);
    updateSleepDto.isDeleted = false;
    return this.databaseService.sleep.update({
      where: { sleepId: sleepId },
      data: updateSleepDto,
    });
  }

  async deleteSleepRecord(parentId: number, sleepId: number) {
    const sleepRecord = await this.databaseService.sleep.findUnique({
      where: {
        sleepId: sleepId,
        isDeleted: false
      },
    });

    if (!sleepRecord) {
      throw new NotFoundException(`Sleep record with ID ${sleepId} not found.`);
    }
    await this.verifyParentChildRelation(parentId, sleepRecord.childId);

    return this.databaseService.sleep.update({
      where: { sleepId: sleepId },
      data: { isDeleted: true }
    });
  }

  async summary(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);

    const records = await this.databaseService.sleep.findMany({
      where: {
        childId: childId,
        isDeleted: false,
      },
      select: {
        date: true,
        duration: true,
      },
      orderBy: {
        date: 'asc',
      },
      take: 20,
    });

    if (records.length === 0) {
      throw new NotFoundException('No sleep records found for this child.');
    }

    const dayStartHour = 6;
    const nightStartHour = 18;

    let dayTimeDuration = 0;
    let nightTimeDuration = 0;
    let totalDuration = 0;
    const intervals = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const sleepDate = new Date(record.date);
      const sleepHour = sleepDate.getHours();
      totalDuration += record.duration;

      if (sleepHour >= dayStartHour && sleepHour < nightStartHour) {
        dayTimeDuration += record.duration;
      } else {
        nightTimeDuration += record.duration;
      }

      if (i > 0) {
        const prevDate = new Date(records[i - 1].date);
        const interval = (prevDate.getTime() - sleepDate.getTime()) / (1000 * 60);
        intervals.push(interval);
      }
    }

    const formatDuration = (duration: number) => {
      const hours = Math.floor(duration / 60);
      const minutes = Math.round(duration % 60);
      return { hours, minutes };
    };

    const averageDayTimeDuration = dayTimeDuration / records.length;
    const averageNightTimeDuration = nightTimeDuration / records.length;
    const averageTotalDuration = totalDuration / records.length;
    const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;

    return {
      startingDay: new Date(records[0].date).toISOString().split('T')[0],
      endingDay: new Date(records[records.length - 1].date).toISOString().split('T')[0],
      averageDayTimeDuration: formatDuration(averageDayTimeDuration),
      averageNightTimeDuration: formatDuration(averageNightTimeDuration),
      averageTotalDuration: formatDuration(averageTotalDuration),
      averageInterval: formatDuration(averageInterval),
    };
  }
}