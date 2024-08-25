import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChildService } from './child.service';
import { Parent, Prisma } from '@prisma/client'
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('child')
export class ChildController {
  constructor(private readonly childService: ChildService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createChildDto: Prisma.ChildCreateInput, @CurrentUser() parent: Parent) {
    return this.childService.create(createChildDto, parent.parentId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() parent : Parent) {
    return this.childService.findAll(parent.parentId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number,@CurrentUser() parent : Parent) {
    return this.childService.findOne(+id, parent.parentId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateChildDto: Prisma.ChildUpdateInput,@CurrentUser () parent:Parent) {
    return this.childService.update(+id,updateChildDto,parent.parentId );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.childService.remove(+id);
  }
}
