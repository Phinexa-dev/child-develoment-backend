import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('medicine-def')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createMedicineDto: Prisma.MedicineDefCreateInput) {
    return this.medicineService.create(createMedicineDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.medicineService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    const Id= parseInt(id,10);
    if(isNaN(Id)){
      throw new BadRequestException('Invalid id format.');
    }
    return this.medicineService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateMedicineDto: Prisma.MedicineDefUpdateInput) {
    const Id= parseInt(id,10);
    if(isNaN(Id)){
      throw new BadRequestException('Invalid id format.');
    }
    return this.medicineService.update(+id, updateMedicineDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    const Id= parseInt(id,10);
    if(isNaN(Id)){
      throw new BadRequestException('Invalid id format.');
    }
    return this.medicineService.remove(+id);
  }
}
