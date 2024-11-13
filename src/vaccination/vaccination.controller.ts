import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { VaccinationService } from './vaccination.service';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Parent } from '@prisma/client';

@Controller('vaccination')
export class VaccinationController {
  constructor(private readonly vaccinationService: VaccinationService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createVaccinationDto: CreateVaccinationDto,
    @CurrentUser() parent: Parent,
  ) {
    return this.vaccinationService.create(createVaccinationDto, parent.parentId);
  }

  @Get(':childId')
  @UseGuards(JwtAuthGuard)
  findAll(
    @Param('childId') childId: string,
    @CurrentUser() parent: Parent
  ) {
    const childIdNumber = parseInt(childId, 10);
    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.vaccinationService.findAll(parent.parentId, childIdNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.vaccinationService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @CurrentUser() parent: Parent,
    @Body() updateVaccinationDto: UpdateVaccinationDto) {
    return this.vaccinationService.update(+id, updateVaccinationDto, parent.parentId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @CurrentUser() parent: Parent
  ) {
    return this.vaccinationService.remove(+id, parent.parentId);
  }
}
