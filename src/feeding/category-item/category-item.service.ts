import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateCategoryItemDto } from './category-item-dto/create-category-item-dto';
import { UpdateCategoryItemDto } from './category-item-dto/update-category-item-dto';

@Injectable()
export class CategoryItemService {

  constructor(private readonly databaseService: DatabaseService) { }

  async create(createCategoryItemDto: CreateCategoryItemDto, parentId: number) {
    const categoryExists = await this.databaseService.category.findUnique({
      where: { categoryId: createCategoryItemDto.categoryId },
    });

    if (!categoryExists) {
      throw new NotFoundException('Category with the provided ID does not exist.');
    }

    if (!createCategoryItemDto.isDefault) {
      const existingItem = await this.databaseService.categoryItems.findFirst({
        where: {
          categoryId: createCategoryItemDto.categoryId,
          itemName: { equals: createCategoryItemDto.name, mode: 'insensitive' },
          parentId: parentId,
          isDeleted: false
        },
      });

      if (existingItem) {
        throw new BadRequestException('A category item with this name already exists in the category.');
      }
    }

    const categoryItemData: Prisma.CategoryItemsCreateInput = {
      itemName: createCategoryItemDto.name,
      isDefault: createCategoryItemDto.isDefault,
      category: { connect: { categoryId: createCategoryItemDto.categoryId } },
      parent: !createCategoryItemDto.isDefault ? { connect: {parentId: parentId} } : undefined,
      imagePath: createCategoryItemDto.imagePath
    };

    return this.databaseService.categoryItems.create({ data: categoryItemData });
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

  async update(id: number, parentId: number, updateCategoryItemDto: UpdateCategoryItemDto) {
    const categoryItem = await this.databaseService.categoryItems.findUnique({
      where: { itemId: id },
    });

    if (!categoryItem || categoryItem.isDeleted) {
      throw new NotFoundException(`CategoryItem with id ${id} not found.`);
    }

    if (categoryItem.isDefault) {
      throw new BadRequestException(`Default category items cannot be updated.`);
    }

    if (!categoryItem.isDefault && updateCategoryItemDto.isDefault) {
      throw new BadRequestException(`Cannot mark a non-default category item as default.`);
    }

    if (categoryItem.parentId !== parentId) {
      throw new UnauthorizedException(`You are not authorized to update this category item.`);
    }

    return this.databaseService.categoryItems.update({
      where: { itemId: id },
      data: updateCategoryItemDto,
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
