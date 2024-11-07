import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

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

  async create(createSolidDto: Prisma.SolidsCreateInput, parentId: number) {
    await this.verifyParentChildRelation(parentId, createSolidDto.child.connect.childId);

    const categoriesToCreate = Array.isArray(createSolidDto.categories.create)
      ? createSolidDto.categories.create
      : [createSolidDto.categories.create];

    for (const category of categoriesToCreate) {
      if ('categoryItem' in category && category.categoryItem) {
        const itemId = category.categoryItem.connect.itemId;

        const categoryItemExists = await this.databaseService.categoryItems.findUnique({
          where: { itemId, isDeleted: false },
        });

        if (!categoryItemExists) {
          throw new NotFoundException(`CategoryItem with itemId ${itemId} does not exist.`);
        }
      } else {
        throw new BadRequestException(`Missing categoryItem in the provided data.`);
      }
    }

    return this.databaseService.solids.create({
      data: createSolidDto,
    });
  }

  async findAll(parentId: number, childId: number) {
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

  async update(id: number, parentId: number, updateSolidDto: Prisma.SolidsUpdateInput) {
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
