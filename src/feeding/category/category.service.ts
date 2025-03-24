import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { CreateCategoryDto } from './category-dto/create-category-dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CategoryService {

  constructor(private readonly databaseService: DatabaseService, private readonly configService: ConfigService) { }
  

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const existingCategory = await this.databaseService.category.findMany({
        where: { name: { equals: createCategoryDto.name, mode: 'insensitive' } },
      });

      if (existingCategory.length !== 0) {
        throw new BadRequestException(`Category '${createCategoryDto.name}' already exists`);
      }

      const newCategory = await this.databaseService.category.create({
        data: {
          name: createCategoryDto.name,
          imagePath: createCategoryDto.imagePath, // Relative path
        },
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

      const baseUrl = this.configService.get<string>('ENV'); // Fetch base URL

      // Update each category's imagePath
      const updatedCategories = categories.map(category => ({
        ...category,
        imagePath: category.imagePath 
          ? `${baseUrl}/food-categories/${category.imagePath}` 
          : null,
      }));
      
      return updatedCategories;
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

      const baseUrl = this.configService.get<string>('ENV'); // Fetch base URL

      const updatedCategory = {
        ...category,
        imagePath: category.imagePath 
          ? `${baseUrl}/food-categories/${category.imagePath}` 
          : null,
      };

      return updatedCategory;
    } catch (error) {
      throw (error);
    }
  }


  // not valid as this doesn't consider the imagePath
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
