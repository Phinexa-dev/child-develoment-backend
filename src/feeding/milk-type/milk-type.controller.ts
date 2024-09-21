import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { MilkTypeService } from './milk-type.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('milk-type')
export class MilkTypeController {
  constructor(private readonly milkTypeService: MilkTypeService) { }

  @Post()
  create(@Body() createMilkTypeDto: Prisma.MilkTypeCreateInput) {
    return this.milkTypeService.create(createMilkTypeDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.milkTypeService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    const recID = parseInt(id, 10)
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.milkTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMilkTypeDto: Prisma.MilkTypeUpdateInput) {
    const recID = parseInt(id, 10)
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.milkTypeService.update(+id, updateMilkTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const recID = parseInt(id, 10)
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.milkTypeService.remove(+id);
  }
}
