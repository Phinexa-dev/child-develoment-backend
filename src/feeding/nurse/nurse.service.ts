import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateNurseDto } from './dto/create-nurse-dto';
import { UpdateNurseDto } from './dto/update-nurse-dto';

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
        date: createNurseDto.date,
        time: createNurseDto.time,
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
        take: limit,
        skip: offset, 
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
}
