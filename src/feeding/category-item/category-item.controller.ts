import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryItemService } from './category-item.service';
import { Parent, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';


@Controller('category-item')
export class CategoryItemController {
  constructor(private readonly categoryItemService: CategoryItemService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCategoryItemDto: Prisma.CategoryItemsCreateInput,
    @CurrentUser() parent: Parent,) {
    return this.categoryItemService.create(createCategoryItemDto, parent.parentId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() parent: Parent) {
    return this.categoryItemService.findAll(parent.parentId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() parent: Parent) {
    return this.categoryItemService.findOne(+id, parent.parentId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCategoryItemDto: Prisma.CategoryItemsUpdateInput, @CurrentUser() parent: Parent) {
    return this.categoryItemService.update(+id,parent.parentId, updateCategoryItemDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string,@CurrentUser() parent: Parent) {
    return this.categoryItemService.remove(+id,parent.parentId);
  }
}
