import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { CreateBottleDto } from './dto/create-bottle-dto';
import { UpdateBottleDto } from './dto/update-bottle-dto';

@Injectable()
export class BottleService {
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

  async create(createBottleDto: CreateBottleDto, parentId: number) {
    try {
      await this.verifyParentChildRelation(parentId, createBottleDto.childId);

      const milkTypeExists = await this.databaseService.milkType.findUnique({
        where: {
          typeID: createBottleDto.milkTypeId,
          isDeleted: false
        },
      });

      if (!milkTypeExists) {
        throw new BadRequestException('Invalid milkType: Milk type does not exist.');
      }

      return this.databaseService.bottle.create({
        data: {
          date: createBottleDto.date,
          time: createBottleDto.time,
          volume: createBottleDto.volume,
          stash: createBottleDto.stash,
          notes: createBottleDto.notes,
          child: {
            connect: { childId: createBottleDto.childId },
          },
          milkType: {
            connect: { typeID: createBottleDto.milkTypeId },
          },
        },
      });
    } catch (e) {
      throw new BadRequestException(e.message || e);
    }
  }

  async findAll(parentId: number, childId: number, limit: number, offset: number) {
    try {
      await this.verifyParentChildRelation(parentId, childId);

      return this.databaseService.bottle.findMany({
        where: {
          childId: childId,
          isDeleted: false,
        },
        select: {
          id: true,
          childId: true,
          typeId: true,
          volume: true,
          stash: true,
          date: true,
          time: true,
          notes: true
        },
        take: limit,
        skip: offset,
        orderBy: {
          date: 'desc'
        }

      });
    } catch (e) {
      throw new BadRequestException(e.message || e);
    }
  }

  async findOne(id: number, parentId: number) {
    try {
      const bottleRecord = await this.databaseService.bottle.findUnique({
        where: {
          id: id,
          isDeleted: false,
        },
        include: {
          milkType: true,
        },
      });

      if (!bottleRecord) {
        throw new NotFoundException('Bottle record not found');
      }

      await this.verifyParentChildRelation(parentId, bottleRecord.childId);

      return bottleRecord;
    } catch (e) {
      throw new BadRequestException(e.message || e);
    }
  }

  async update(id: number, updateBottleDto: UpdateBottleDto, parentId: number) {
    try {

      const bottleRecord = await this.databaseService.bottle.findUnique({
        where: {
          id,
          isDeleted: false
        },
      });

      if (!bottleRecord) {
        throw new NotFoundException('Bottle record not found');
      }

      await this.verifyParentChildRelation(parentId, bottleRecord.childId);

      if (updateBottleDto.milkTypeId) {
        const milkTypeExists = await this.databaseService.milkType.findUnique({
          where: {
            typeID: updateBottleDto.milkTypeId,
            isDeleted: false
          },
        });
        if (!milkTypeExists) {
          throw new BadRequestException('Invalid milkType: Milk type does not exist.');
        }
      }

      return this.databaseService.bottle.update({
        where: { id },
        data: {
          date: updateBottleDto.date ?? bottleRecord.date,
          time: updateBottleDto.time ?? bottleRecord.time,
          volume: updateBottleDto.volume ?? bottleRecord.volume,
          stash: updateBottleDto.stash ?? bottleRecord.stash,
          notes: updateBottleDto.notes ?? bottleRecord.notes,
          milkType: {
            connect: { typeID: updateBottleDto.milkTypeId || bottleRecord.typeId },
          },
        },
      });
    } catch (e) {
      throw new BadRequestException(e.message || e);
    }
  }

  async getBottleRecordsBetweenDates(parentId: number, childId: number, startDate: Date, endDate: Date) {
    await this.verifyParentChildRelation(parentId, childId);
    return this.databaseService.bottle.findMany({
      where: {
        childId: childId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        milkType: true,
      },
    });
  }

  async remove(id: number, parentId: number) {
    try {
      const bottleRecord = await this.databaseService.bottle.findUnique({
        where: {
          id,
          isDeleted: false
        },
      });

      if (!bottleRecord) {
        throw new NotFoundException('Bottle record not found');
      }

      await this.verifyParentChildRelation(parentId, bottleRecord.childId);

      return this.databaseService.bottle.update({
        where: { id },
        data: { isDeleted: true }
      });
    } catch (e) {
      throw new BadRequestException(e.message || e);
    }
  }

  async summary(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);

    const records = await this.databaseService.bottle.findMany({
      where: {
        childId: childId,
        isDeleted: false,
      },
      select: {
        stash: true,
        date: true,
        volume: true,
      },
      orderBy: {
        date: 'asc',
      },
      take: 20,
    });

    if (records.length === 0) {
      return  records;
    }

    const volumes = records.map(record => record.volume || 0);

    const totalVolume = volumes.reduce((sum, volume) => sum + volume, 0);
    const averageVolume = totalVolume / volumes.length;

    const minVolume = Math.min(...volumes);
    const maxVolume = Math.max(...volumes);

    const startingDate = records[0].date;
    const endingDate = records[records.length - 1].date;

    return {
      startingDate,
      endingDate,
      minVolume: parseFloat(minVolume.toFixed(2)),
      maxVolume: parseFloat(maxVolume.toFixed(2)),
      averageVolume: parseFloat(averageVolume.toFixed(2)),
    };
  }

}
