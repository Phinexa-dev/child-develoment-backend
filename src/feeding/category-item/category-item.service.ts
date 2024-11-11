import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CategoryItemService {

  constructor(private readonly databaseService: DatabaseService) { }

  async create(createCategoryItemDto: Prisma.CategoryItemsCreateInput, parentId: number) {
    const categoryExists = await this.databaseService.category.findUnique({
      where: { categoryId: createCategoryItemDto.category.connect.categoryId },
    });

    if (!categoryExists) {
      throw new NotFoundException('Category with the provided ID does not exist.');
    }

    if (!createCategoryItemDto.isDefault) {
      const existingItem = await this.databaseService.categoryItems.findFirst({
        where: {
          categoryId: createCategoryItemDto.category.connect.categoryId,
          itemName: { equals: createCategoryItemDto.itemName, mode: 'insensitive' },
          parentId,
          isDeleted: false
        },
      });

      if (existingItem) {
        throw new BadRequestException('A category item with this name already exists in the category.');
      }
    }

    if (createCategoryItemDto.isDefault) {
      createCategoryItemDto.parent = null;
    }

    const categoryItemData: Prisma.CategoryItemsCreateInput = {
      ...createCategoryItemDto,
      parent: !createCategoryItemDto.isDefault ? { connect: { parentId } } : undefined,
    };

    return this.databaseService.categoryItems.create({
      data: categoryItemData,
    });
  }


  async findAll(parentID: number) {
    return this.databaseService.categoryItems.findMany({
      where: {
        OR: [
          { isDefault: true },
          { parentId: parentID },
        ],
        isDeleted: false
      },
      include: {
        category: true,
      },
    });
  }

  async findOne(id: number, parentID: number) {
    const categoryItem = await this.databaseService.categoryItems.findFirst({
      where: {
        itemId: id,
        OR: [
          { isDefault: true },
          { parentId: parentID },
        ],
        isDeleted: false
      },
      include: {
        category: true,
      },
    });

    if (!categoryItem) {
      throw new NotFoundException(`CategoryItem with id ${id} not found or does not belong to the user.`);
    }
    return categoryItem;
  }

  async update(id: number, parentID: number, updateCategoryItemDto: Prisma.CategoryItemsUpdateInput) {
    const categoryItem = await this.databaseService.categoryItems.findUnique({
      where: {
        itemId: id,
        isDefault: false
      },
    });
    if (!categoryItem) {
      throw new NotFoundException(`CategoryItem with id ${id} not found.`);
    }
    if (categoryItem.isDefault) {
      throw new BadRequestException(`Default category items cannot be updated.`);
    }
    if (!categoryItem.isDefault && updateCategoryItemDto.isDefault) {
      throw new BadRequestException();
    }
    if (categoryItem.parentId !== parentID) {
      throw new UnauthorizedException(`You are not authorized to update this category item.`);
    }
    return this.databaseService.categoryItems.update({
      where: { itemId: id },
      data: {
        ...updateCategoryItemDto,
      },
    });
  }

  async remove(id: number, parentId: number) {
    const categoryItem = await this.databaseService.categoryItems.findUnique({
      where: {
        itemId: id,
        isDeleted: false,
        parentId
      },
    });
    if (!categoryItem) {
      throw new NotFoundException(`CategoryItem with id ${id} not found.`);
    }
    if (categoryItem.isDefault) {
      throw new BadRequestException(`Default category items cannot be deleted.`);
    }
    return this.databaseService.categoryItems.update({
      where: { itemId: id },
      data: { isDeleted: false }
    });
  }
}
