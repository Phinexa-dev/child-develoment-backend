import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateCategoryItemDto } from './category-item-dto/create-category-item-dto';
import { UpdateCategoryItemDto } from './category-item-dto/update-category-item-dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CategoryItemService {

  constructor(private readonly databaseService: DatabaseService, private readonly configService: ConfigService) { }

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
    try {
      const baseUrl = this.configService.get<string>('ENV'); // Fetch base URL
  
      const categoryItems = await this.databaseService.categoryItems.findMany({
        where: {
          OR: [
            { isDefault: true },
            { parentId: parentID },
          ],
          isDeleted: false,
        },
        include: {
          category: true,
        },
      });
  
      // Map over the result to update imagePath for both category and item
      const updatedCategoryItems = categoryItems.map(item => ({
        ...item,
        imagePath: item.imagePath 
          ? `${baseUrl}/food-items/${item.imagePath}` 
          : null, // Update item imagePath
        category: {
          ...item.category,
          imagePath: item.category.imagePath
            ? `${baseUrl}/food-categories/${item.category.imagePath}` 
            : null, // Update category imagePath
        },
      }));
  
      return updatedCategoryItems;
    } catch (error) {
      throw error;
    }
    // return this.databaseService.categoryItems.findMany({
    //   where: {
    //     OR: [
    //       { isDefault: true },
    //       { parentId: parentID },
    //     ],
    //     isDeleted: false
    //   },
    //   include: {
    //     category: true,
    //   },
    // });
  }

  async findOne(id: number, parentID: number) {

    try {
      const baseUrl = this.configService.get<string>('ENV'); // Fetch base URL
  
      const categoryItem = await this.databaseService.categoryItems.findFirst({
        where: {
          OR: [
            { isDefault: true },
            { parentId: parentID },
          ],
          isDeleted: false,
        },
        include: {
          category: true,
        },
      });
  
      // Map over the result to update imagePath for both category and item
      const updatedCategoryItem = {
        ...categoryItem,
        imagePath: categoryItem.imagePath 
          ? `${baseUrl}/food-items/${categoryItem.imagePath}` 
          : null, // Update item imagePath
        category: {
          ...categoryItem.category,
          imagePath: categoryItem.category.imagePath
            ? `${baseUrl}/food-categories/${categoryItem.category.imagePath}` 
            : null, // Update category imagePath
        },
      };
  
      return updatedCategoryItem;
    } catch (error) {
      throw error;
    }

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
