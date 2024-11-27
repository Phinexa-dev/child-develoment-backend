import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateGrowthDto } from './dto/create-growth-dto';
import { UpdateGrowthDto } from './dto/update-growth-dto';


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
    return await this.databaseService.growth.create({
      data: {
        date: createGrowthDto.date,
        weight: createGrowthDto.weight,
        height: createGrowthDto.height,
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
}
