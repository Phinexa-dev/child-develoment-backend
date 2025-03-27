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

    if (createSolidDto.ingredients) {
      for (const category of createSolidDto.ingredients) {
        const itemId = category.id;
        const categoryItemExists = await this.databaseService.categoryItems.findFirst({
          where: {
            itemId,
            isDeleted: false,
            // AND: [
            //   {
            //     OR: [
            //       // { isDefault: true },
            //       { parentId: parentId },
            //     ],
            //   },
            // ],
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
      dateTime: createSolidDto.dateTime,
      child: {
        connect: { childId: createSolidDto.childId },
      },
      categories: createSolidDto.ingredients
        ? {
          create: createSolidDto.ingredients.map(category => ({
            numberOfUnits: category.numberOfUnits,
            unitOfMeasure: category.unitOfMeasure,
            categoryItem: {
              connect: { itemId: category.id },
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

    const data = await this.databaseService.solids.findMany({
      where: {
        childId: childId,
        isDeleted: false,
        categories: {
          some: {
            isDeleted: false
          }
        }
      },
      select: {
        solidId: true,
        reaction: true,
        note: true,
        dateTime: true,
        categories: {
          select: {
            id: true,
            numberOfUnits: true,
            unitOfMeasure: true,
            categoryItem: {
              select: {
                itemId: true,
                itemName: true,
                imagePath: true
              }
            }
          }
        }
      },
      take: limit,
      skip: offset,
      orderBy: {
        dateTime: 'desc'
      }
    });
    return transformResponse(data);
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

    return transformResponse(this.databaseService.solids.findMany({
      where: {
        childId: childId,
        dateTime: {
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
    }));
  }

  async update(id: number, parentId: number, updateSolidDto: UpdateSolidDto) {
    const { ingredients, ...solidData } = updateSolidDto;

    const solid = await this.databaseService.solids.findUnique({
      where: {
        solidId: id,
        isDeleted: false,
      },
      include: {
        categories: { select: { id: true, isDeleted: true } },
      },
    });

    if (!solid) {
      throw new NotFoundException(`Solid with id ${id} not found.`);
    }

    await this.verifyParentChildRelation(parentId, solid.childId);

    if (ingredients && ingredients.length > 0) {
      const existingIngredientIds = solid.categories.map(ingredient => ingredient.id);
      const ingredientIdsToUpdate = ingredients.map(i => i.id);

      const ingredientsToDelete = existingIngredientIds.filter(id => !ingredientIdsToUpdate.includes(id));
      const ingredientsToAdd = ingredients.filter(i => !existingIngredientIds.includes(i.id));

      await this.databaseService.solidCat.updateMany({
        where: {
          id: { in: ingredientsToDelete },
          solidId: id,
        },
        data: { isDeleted: true },
      });

      await Promise.all(
        ingredientsToAdd.map(ingredient =>
          this.databaseService.solidCat.create({
            data: {
              unitOfMeasure: ingredient.unitOfMeasure,
              numberOfUnits: ingredient.numberOfUnits,
              solid: {
                connect: {
                  solidId: id,
                },
              },
              categoryItem: {
                connect: {
                  itemId: ingredient.id,
                },
              },
            },
          })
        )
      );
    } else if (ingredients && ingredients.length === 0) {
      await this.databaseService.solidCat.updateMany({
        where: { solidId: id },
        data: { isDeleted: true },
      });
    }

    return this.databaseService.solids.update({
      where: { solidId: id },
      data: solidData,
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

    await this.verifyParentChildRelation(parentId, solid.childId);

    await this.databaseService.solidCat.updateMany({
      where: { solidId: id },
      data: { isDeleted: true }
    });

    return this.databaseService.solids.update({
      where: { solidId: id },
      data: { isDeleted: true }
    });
  }

}


function transformResponse(data) {
  return data.map(item => ({
    id: item.solidId,
    reaction: item.reaction,
    note: item.note,
    dateTime: item.dateTime,
    ingredients: item.categories.map(category => ({
      id: category.id,
      name: category.categoryItem.itemName,
      unitOfMeasure: category.unitOfMeasure,
      numberOfUnits: category.numberOfUnits || 0,
      imagePath: category.categoryItem.imagePath
    }))
  }));
}