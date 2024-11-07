import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

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

  async create(createBottleDto: Prisma.BottleCreateInput, parentId: number) {
    try {
      await this.verifyParentChildRelation(parentId, createBottleDto.child.connect.childId);

      if (!createBottleDto.date || !createBottleDto.time) {
        throw new BadRequestException('Date and Time must be provided');
      }
      if (isNaN(Date.parse(createBottleDto.date.toString()))) {
        throw new BadRequestException('Invalid date format, expected ISO-8601 DateTime');
      }
      if (isNaN(Date.parse(createBottleDto.time.toString()))) {
        throw new BadRequestException('Invalid time format, expected ISO-8601 DateTime');
      }
      if (!createBottleDto.volume && !createBottleDto.stash && !createBottleDto.notes) {
        throw new BadRequestException('Bottle must contain at least one of volume, stash, or notes');
      }
      if (createBottleDto.volume !== undefined && (typeof createBottleDto.volume !== 'number' || isNaN(createBottleDto.volume))) {
        throw new BadRequestException('Volume must be a valid number.');
      }

      const milkTypeExists = await this.databaseService.milkType.findUnique({
        where: {
          typeID: createBottleDto.milkType.connect.typeID,
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
            connect: { childId: createBottleDto.child.connect.childId },
          },
          milkType: {
            connect: { typeID: createBottleDto.milkType.connect.typeID },
          },
        },
      });
    } catch (e) {
      throw new BadRequestException(e.message || e);
    }
  }

  async findAll(parentId: number, childId: number) {
    try {
      await this.verifyParentChildRelation(parentId, childId);

      return this.databaseService.bottle.findMany({
        where: {
          childId: childId,
          isDeleted: false,
        },
        include: {
          milkType: true,
        },
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

  async update(id: number, updateBottleDto: Prisma.BottleUpdateInput, parentId: number) {
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

      if (updateBottleDto.date && isNaN(Date.parse(updateBottleDto.date.toString()))) {
        throw new BadRequestException('Invalid date format, expected ISO-8601 DateTime');
      }
      if (updateBottleDto.time && isNaN(Date.parse(updateBottleDto.time.toString()))) {
        throw new BadRequestException('Invalid time format, expected ISO-8601 DateTime');
      }
      if (updateBottleDto.milkType?.connect?.typeID) {
        const milkTypeExists = await this.databaseService.milkType.findUnique({
          where: { typeID: updateBottleDto.milkType.connect.typeID },
        });
        if (!milkTypeExists) {
          throw new BadRequestException('Invalid milkType: Milk type does not exist.');
        }
      }
      if (updateBottleDto.volume !== undefined && (typeof updateBottleDto.volume !== 'number' || isNaN(updateBottleDto.volume))) {
        throw new BadRequestException('Volume must be a valid number.');
      }

      if (
        updateBottleDto.volume === null &&
        updateBottleDto.stash === null &&
        updateBottleDto.notes === null
      ) {
        throw new BadRequestException('Bottle must contain at least one of volume, stash, or notes');
      }

      return this.databaseService.bottle.update({
        where: { id: id },
        data: {
          date: updateBottleDto.date ?? bottleRecord.date,
          time: updateBottleDto.time ?? bottleRecord.time,
          volume: updateBottleDto.volume ?? bottleRecord.volume,
          stash: updateBottleDto.stash ?? bottleRecord.stash,
          notes: updateBottleDto.notes ?? bottleRecord.notes,
          milkType: {
            connect: { typeID: updateBottleDto.milkType?.connect?.typeID || bottleRecord.typeId },
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
}
