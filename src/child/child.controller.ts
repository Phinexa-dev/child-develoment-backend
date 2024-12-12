import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChildService } from './child.service';
import { Parent } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CreateChildDto } from './dto/create-child-dto';
import { UpdateChildDto } from './dto/update-child-dto';

@Controller('child')
export class ChildController {
  constructor(private readonly childService: ChildService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createChildDto: CreateChildDto, @CurrentUser() parent: Parent) {
    return this.childService.create(createChildDto, parent.parentId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() parent: Parent) {
    return this.childService.findAll(parent.parentId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number, @CurrentUser() parent: Parent) {
    return this.childService.findOne(+id, parent.parentId);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateChildDto: UpdateChildDto, @CurrentUser() parent: Parent) {
    return this.childService.update(+id, updateChildDto, parent.parentId);
  }

  @Get('delete/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number, @CurrentUser() parent: Parent) {
    return this.childService.remove(+id, parent.parentId);
  }
}
