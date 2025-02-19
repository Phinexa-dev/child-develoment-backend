import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  create(@Body() createCategoryDto: Prisma.CategoryCreateInput) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    const recID = parseInt(id, 10);
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid Category id format.');
    }
    return this.categoryService.findOne(recID);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: Prisma.CategoryUpdateInput) {
    const recID = parseInt(id, 10);
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid Category id format.');
    }
    return this.categoryService.update(recID, updateCategoryDto);
  }

  @Get('delete/:id')
  remove(@Param('id') id: string) {
    const recID = parseInt(id, 10);
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid Category id format.');
    }
    return this.categoryService.remove(recID);
  }
}