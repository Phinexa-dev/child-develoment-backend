import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { CreateSolidDto } from './dto/create-solid-dto';
import { off } from 'process';
import { UpdateSolidDto } from './dto/update-solid-dto';

@Injectable()
export class SolidService {

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

  async create(createSolidDto: CreateSolidDto, parentId: number) {
    await this.verifyParentChildRelation(parentId, createSolidDto.childId);

    if (createSolidDto.categories) {
      for (const category of createSolidDto.categories) {
        const itemId = category.itemId;
        const categoryItemExists = await this.databaseService.categoryItems.findFirst({
          where: {
            itemId,
            isDeleted: false,
            AND: [
              {
                OR: [
                  { isDefault: true },
                  { parentId: parentId },
                ],
              },
            ],
          },
        });

        if (!categoryItemExists) {
          throw new NotFoundException(`CategoryItem with itemId ${itemId} does not exist.`);
        }
      }
    }
    const solidData: Prisma.SolidsCreateInput = {
      reaction: createSolidDto.reaction,
      note: createSolidDto.note,
      date: createSolidDto.date,
      time: createSolidDto.time,
      child: {
        connect: { childId: createSolidDto.childId },
      },
      categories: createSolidDto.categories
        ? {
          create: createSolidDto.categories.map(category => ({
            weightVolume: category.weightVolume,
            categoryItem: {
              connect: { itemId: category.itemId },
            },
          })),
        }
        : undefined,
    };
    return this.databaseService.solids.create({
      data: solidData,
    });
  }

  async findAll(parentId: number, childId: number, limit: number, offset: number) {
    await this.verifyParentChildRelation(parentId, childId);
    return this.databaseService.solids.findMany({
      where: {
        childId: childId,
        isDeleted: false,

      },
      include: {
        categories: {
          include: {
            categoryItem: {
              include: {
                category: true,
              }
            },
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        date: 'desc'
      }
    });
  }

  async findOne(parentId: number, solidId: number) {
    const solid = await this.databaseService.solids.findUnique({
      where: {
        solidId: solidId,
        isDeleted: false
      },
      include: {
        child: true,
        categories: {
          include: {
            categoryItem: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!solid) {
      throw new NotFoundException(`Solid with id ${solidId} not found.`);
    }

    const parentChildRelation = await this.databaseService.parentChild.findFirst({
      where: {
        parentId: parentId,
        childId: solid.childId,
        status: 'Active',
      },
    });

    if (!parentChildRelation) {
      throw new UnauthorizedException(`This solid does not belong to the authenticated parent's child.`);
    }
    return solid;
  }

  async getSolidRecordsBetweenDates(parentId: number, childId: number, startDate: Date, endDate: Date) {

    await this.verifyParentChildRelation(parentId, childId);

    return this.databaseService.solids.findMany({
      where: {
        childId: childId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        child: true,
        categories: {
          include: {
            categoryItem: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, parentId: number, updateSolidDto: UpdateSolidDto) {
    const solid = await this.databaseService.solids.findUnique({
      where: {
        solidId: id,
        isDeleted: false
      },
    });

    if (!solid) {
      throw new NotFoundException(`Solid with id ${id} not found.`);
    }
    const parentChildRelation = await this.databaseService.parentChild.findFirst({
      where: {
        parentId: parentId,
        childId: solid.childId,
        status: 'Active',
      },
    });

    if (!parentChildRelation) {
      throw new UnauthorizedException(`This solid does not belong to the authenticated parent's child.`);
    }

    return this.databaseService.solids.update({
      where: { solidId: id },
      data: updateSolidDto,
    });
  }

  async remove(id: number, parentId: number) {

    const solid = await this.databaseService.solids.findUnique({
      where: {
        solidId: id,
        isDeleted: false
      },
    });

    if (!solid) {
      throw new NotFoundException(`Solid with id ${id} not found.`);
    }

    const parentChildRelation = await this.databaseService.parentChild.findFirst({
      where: {
        parentId: parentId,
        childId: solid.childId,
        status: 'Active',
      },
    });

    if (!parentChildRelation) {
      throw new UnauthorizedException(`This solid does not belong to the authenticated parent's child.`);
    }

    await this.databaseService.solidCat.updateMany({
      where: { solidId: id },
      data: { isDeleted: false }
    });

    return this.databaseService.solids.update({
      where: { solidId: id },
      data: { isDeleted: false }
    });
  }

}
