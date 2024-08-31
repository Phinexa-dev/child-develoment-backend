import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class GrowthService {
  
  constructor(private readonly databaseService:DatabaseService){}

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

  async create(createGrowthDto: Prisma.GrowthCreateInput, parentId: number) {
    await this.verifyParentChildRelation(parentId, createGrowthDto.child.connect.childId);

    return this.databaseService.growth.create({
      data: {
        date: createGrowthDto.date,
        weight: createGrowthDto.weight,
        height: createGrowthDto.height,
        note: createGrowthDto.note,
        child: {
          connect: { childId: createGrowthDto.child.connect.childId },
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
      },
    });
  }


  async findAll(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId,childId)
    return this.databaseService.growth.findMany({
      where:{
        childId:childId
      }

    });
  }

  findOne(id: number) {
    return `This action returns a #${id} growth`;
  }

  async updateGrowthRecord(parentId: number, growthId: number, updateGrowthDto: Prisma.GrowthUpdateInput) {
   
    const growthRecord = await this.databaseService.growth.findUnique({
      where: { id: growthId },
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
      where: { id: growthId },
    });

    if (!growthRecord) {
      throw new NotFoundException(`Growth record with ID ${growthId} not found.`);
    }

    await this.verifyParentChildRelation(parentId, growthRecord.childId);

    return this.databaseService.growth.delete({
      where: { id: growthId },
    });
  }
}
