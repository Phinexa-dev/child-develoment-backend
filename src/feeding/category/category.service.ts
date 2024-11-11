import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {

  constructor(private readonly databaseService: DatabaseService) { }

  async create(createCategoryDto: Prisma.CategoryCreateInput) {
    try {
      if (!createCategoryDto.name) {
        throw new BadRequestException('Category name is required');
      }
      const existingCategory = await this.databaseService.category.findMany({
        where: {
          name: {
            equals: createCategoryDto.name,
            mode: 'insensitive',
          },
        },
      });
      if (existingCategory.length != 0) {
        throw new BadRequestException(`Category '${createCategoryDto.name}' already exists`);
      }
      const newCategory = await this.databaseService.category.create({
        data: createCategoryDto,
      });

      return newCategory;
    } catch (error) {
      throw (error)
    }
  }

  async findAll() {
    try {
      const categories = await this.databaseService.category.findMany({
      });
      if (!categories.length) {
        throw new NotFoundException('No Categories found');
      }
      return categories;
    } catch (error) {
      throw (error);
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.databaseService.category.findUnique({
        where: { categoryId: id },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID #${id} not found`);
      }

      return category;
    } catch (error) {
      throw (error);
    }
  }

  async update(id: number, updateCategoryDto: Prisma.CategoryUpdateInput) {
    try {
      const category = await this.findOne(id);

      if (!category) {
        throw new NotFoundException();
      }
      const updatedCategory = await this.databaseService.category.update({
        where: { categoryId: id },
        data: updateCategoryDto,
      });

      return updatedCategory;
    } catch (error) {
      throw (error);
    }
  }

  async remove(id: number) {
    try {
      const category = await this.databaseService.category.findUnique({
        where: { categoryId: id },
      });
      if (!category) {
        throw new NotFoundException()
      }
      const deletedMilkType = await this.databaseService.category.delete({
        where: { categoryId: id },
      });

      return deletedMilkType;
    } catch (error) {
      throw (error);
    }
  }
}
