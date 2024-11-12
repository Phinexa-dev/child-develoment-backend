import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { VaccineService } from './vaccine.service';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Parent } from '@prisma/client';

@Controller('vaccine')
export class VaccineController {
  constructor(private readonly vaccineService: VaccineService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createVaccineDto: CreateVaccineDto) {
    return this.vaccineService.create(createVaccineDto);
  }

  @Get(':childId')
  @UseGuards(JwtAuthGuard)
  findAll(
    @Param('childId') childId: string,
    @CurrentUser() parent: Parent) {
    const childID = parseInt(childId, 10);

    if (isNaN(childID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.vaccineService.findAll(parent.parentId, childID);
  }

  @Get(':id/:childId')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id') id: string,
    @Param('childId') childId: string,
    @CurrentUser() parent: Parent) {
    const childID = parseInt(childId, 10);

    if (isNaN(childID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.vaccineService.findOne(+id, parent.parentId, childID);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVaccineDto: UpdateVaccineDto) {
    return this.vaccineService.update(+id, updateVaccineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vaccineService.remove(+id);
  }
}
