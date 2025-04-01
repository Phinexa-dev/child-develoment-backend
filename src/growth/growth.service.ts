import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateGrowthDto } from './dto/create-growth-dto';
import { UpdateGrowthDto } from './dto/update-growth-dto';
import { differenceInMonths, subMonths } from 'date-fns';


@Injectable()
export class GrowthService {

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

  async create(createGrowthDto: CreateGrowthDto, parentId: number) {
    await this.verifyParentChildRelation(parentId, createGrowthDto.childId);

    if (!createGrowthDto.height && !createGrowthDto.weight && !createGrowthDto.note) {
      throw new BadRequestException('body should at least contain either note,weight or height')
    }

    // Fetch the latest record to fill missing values
    const lastRecord = await this.databaseService.growth.findFirst({
      where: { childId: createGrowthDto.childId, isDeleted: false },
      orderBy: { date: 'desc' },
    });

    // Fill missing values with last known values if available
    let weight = createGrowthDto.weight;
    let height = createGrowthDto.height;

    if (!weight && lastRecord) {
      weight = lastRecord.weight;
    }

    if (!height && lastRecord) {
      height = lastRecord.height;
    }

    // Throw error if both weight and height are still missing
    if (!weight && !height) {
      throw new BadRequestException('Either weight or height must be provided');
    }

    return await this.databaseService.growth.create({
      data: {
        date: createGrowthDto.date,
        weight: weight,
        height: height,
        note: createGrowthDto.note,
        child: {
          connect: { childId: createGrowthDto.childId },
        },
      },
    });
  }

  async getGrowthRecordsBetweenDates(parentId: number, childId: number, startDate: Date, endDate: Date) {
    await this.verifyParentChildRelation(parentId, childId);

    return this.databaseService.growth.findMany({
      where: {
        childId: childId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        isDeleted: false
      },
      select: {
        id: true,
        childId: true,
        weight: true,
        height: true,
        note: true,
        date: true
      },
      orderBy: {
        date: 'desc'
      }
    });
  }

  async getChildHeightGrowth(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Fetch average height grouped by month for the current year
    const records = await this.databaseService.growth.findMany({
      where: {
        childId: childId,
        isDeleted: false,
        date: {
          gte: new Date(currentYear, 0, 1),
          lte: new Date(currentYear, 11, 31),
        },
      },
      select: {
        date: true,
        height: true,
      },
      orderBy: { date: 'asc' },
    });

    const monthMap = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(currentYear, i).toLocaleString('default', { month: 'long' }),
      growth: 0,
    }));

    const monthlyHeights = {};

    // Group heights by month
    records.forEach(record => {
      const recordMonth = new Date(record.date).getMonth();
      if (!monthlyHeights[recordMonth]) {
        monthlyHeights[recordMonth] = [];
      }
      monthlyHeights[recordMonth].push(record.height);
    });

    let previousAvgHeight = null;

    // Calculate average growth for each month
    for (let i = 0; i <= currentMonth; i++) {
      if (monthlyHeights[i] && monthlyHeights[i].length > 0) {
        const sum = monthlyHeights[i].reduce((a, b) => a + b, 0);
        const avgHeight = sum / monthlyHeights[i].length;

        if (previousAvgHeight !== null) {
          monthMap[i].growth = avgHeight - previousAvgHeight;
        }

        previousAvgHeight = avgHeight;
      }
    }

    // Set future months to zero
    for (let i = currentMonth + 1; i < 12; i++) {
      monthMap[i].growth = 0;
    }

    return monthMap;
  }

  async getChildWeightGrowth(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);
    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Fetch average height grouped by month for the current year
    const records = await this.databaseService.growth.findMany({
      where: {
        childId: childId,
        isDeleted: false,
        date: {
          gte: new Date(currentYear, 0, 1),
          lte: new Date(currentYear, 11, 31),
        },
      },
      select: {
        date: true,
        weight: true,
      },
      orderBy: { date: 'asc' },
    });

    const monthMap = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(currentYear, i).toLocaleString('default', { month: 'long' }),
      growth: 0,
    }));

    const monthlyHeights = {};

    // Group heights by month
    records.forEach(record => {
      const recordMonth = new Date(record.date).getMonth();
      if (!monthlyHeights[recordMonth]) {
        monthlyHeights[recordMonth] = [];
      }
      monthlyHeights[recordMonth].push(record.weight);
    });

    let previousAvgHeight = null;

    // Calculate average growth for each month
    for (let i = 0; i <= currentMonth; i++) {
      if (monthlyHeights[i] && monthlyHeights[i].length > 0) {
        const sum = monthlyHeights[i].reduce((a, b) => a + b, 0);
        const avgHeight = sum / monthlyHeights[i].length;

        if (previousAvgHeight !== null) {
          monthMap[i].growth = avgHeight - previousAvgHeight;
        }

        previousAvgHeight = avgHeight;
      }
    }

    // Set future months to zero
    for (let i = currentMonth + 1; i < 12; i++) {
      monthMap[i].growth = 0;
    }

    return monthMap;
  }

  async findAll(parentId: number, childId: number, limit: number, offset: number) {
    await this.verifyParentChildRelation(parentId, childId)
    return this.databaseService.growth.findMany({
      where: {
        childId: childId,
        isDeleted: false
      },
      select: {
        id: true,
        childId: true,
        weight: true,
        height: true,
        note: true,
        date: true
      },
      orderBy: {
        date: 'desc'
      },
      take: limit,
      skip: offset
    });
  }

  async findOne(id: number, parentId: number) {
    const record = await this.databaseService.growth.findUnique({
      where: {
        id,
        isDeleted: false
      },
      select: {
        id: true,
        childId: true,
        weight: true,
        height: true,
        note: true,
        date: true
      }
    })
    if (!record) {
      throw new NotFoundException("Growth Record Not Found");
    }
    await this.verifyParentChildRelation(parentId, record.childId);
    return record;
  }

  async updateGrowthRecord(parentId: number, growthId: number, updateGrowthDto: UpdateGrowthDto) {

    const growthRecord = await this.databaseService.growth.findUnique({
      where: { id: growthId, isDeleted: false },
    });

    if (!growthRecord) {
      throw new NotFoundException(`Growth record with ID ${growthId} not found.`);
    }

    await this.verifyParentChildRelation(parentId, growthRecord.childId);

    return this.databaseService.growth.update({
      where: { id: growthId },
      data: updateGrowthDto,
    });
  }

  async deleteGrowthRecord(parentId: number, growthId: number) {

    const growthRecord = await this.databaseService.growth.findUnique({
      where: {
        id: growthId,
        isDeleted: false
      },
    });
    if (!growthRecord) {
      throw new NotFoundException(`Growth record with ID ${growthId} not found.`);
    }
    await this.verifyParentChildRelation(parentId, growthRecord.childId);
    return this.databaseService.growth.update({
      where: { id: growthId },
      data: { isDeleted: true }
    });
  }

  async summary(parentId: number, childId: number) {

    await this.verifyParentChildRelation(parentId, childId);

    const records = await this.databaseService.growth.findMany({
      where: {
        childId: childId,
        isDeleted: false
      },
      select: {
        height: true,
        weight: true,
        date: true
      },
    });

    return records;
  }

  async dataPoints(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);

    const child = await this.databaseService.child.findUnique({
      where: { childId },
      select: { birthday: true },
    });

    const birthday = child.birthday;

    const growthRecords = await this.databaseService.growth.findMany({
      where: {
        childId,
        isDeleted: false,
      },
      select: {
        height: true,
        weight: true,
        date: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const dataPoints = growthRecords.map(record => ({
      months: differenceInMonths(new Date(record.date), new Date(birthday)),
      height: record.height || null,
      weight: record.weight || null,
    }));

    return dataPoints;
  }

  async summaryHeight(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);

    const records = await this.databaseService.growth.findMany({
      where: {
        childId: childId,
        isDeleted: false,
        height: { not: null },
      },
      select: {
        height: true,
        date: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    if (records.length === 0) {
      return {};
      // throw new NotFoundException("No height records found for this child.");
    }

    const lastRecord = records[0];

    const filteredRecords = records.filter(record => {
      const lastRecordMonth = new Date(lastRecord.date).getMonth();
      const lastRecordYear = new Date(lastRecord.date).getFullYear();

      const recordMonth = new Date(record.date).getMonth();
      const recordYear = new Date(record.date).getFullYear();

      return !(recordMonth === lastRecordMonth && recordYear === lastRecordYear);
    });

    let heightGrowth = 0;
    let monthsDifference = 0;

    if (filteredRecords.length > 0) {
      const nearestRecord = filteredRecords[0];
      heightGrowth = lastRecord.height - nearestRecord.height;

      const exactDifference = new Date(lastRecord.date).getTime() - new Date(nearestRecord.date).getTime();
      monthsDifference = Math.round(exactDifference / (1000 * 60 * 60 * 24 * 30));
    }

    return {
      lastRecord: lastRecord.height,
      lastRecordDate: lastRecord.date,
      heightGrowth: heightGrowth !== null ? parseFloat(heightGrowth.toFixed(2)) : null,
      monthsDifference: monthsDifference !== null ? monthsDifference : null,
    };
  }

  async summaryWeight(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);

    const records = await this.databaseService.growth.findMany({
      where: {
        childId: childId,
        isDeleted: false,
      },
      select: {
        weight: true,
        date: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    if (records.length === 0) {
      return {};
      // throw new NotFoundException("No weight records found for this child.");
    }

    const lastRecord = records[0];

    const filteredRecords = records.filter(record => {
      const lastRecordMonth = new Date(lastRecord.date).getMonth();
      const lastRecordYear = new Date(lastRecord.date).getFullYear();

      const recordMonth = new Date(record.date).getMonth();
      const recordYear = new Date(record.date).getFullYear();

      return !(recordMonth === lastRecordMonth && recordYear === lastRecordYear);
    });

    let weightGrowth = 0;
    let monthsDifference = 0;

    if (filteredRecords.length > 0) {
      const nearestRecord = filteredRecords[0];
      if (lastRecord.weight !== null && nearestRecord.weight !== null) {
        weightGrowth = lastRecord.weight - nearestRecord.weight;
      }

      const exactDifference = new Date(lastRecord.date).getTime() - new Date(nearestRecord.date).getTime();
      monthsDifference = Math.round(exactDifference / (1000 * 60 * 60 * 24 * 30)); // Approximation of a month
    }

    return {
      lastRecord: lastRecord.weight,
      lastRecordDate: lastRecord.date,
      weightGrowth: weightGrowth !== null ? parseFloat(weightGrowth.toFixed(2)) : null,
      monthsDifference: monthsDifference !== null ? monthsDifference : null,
    };
  }

}
