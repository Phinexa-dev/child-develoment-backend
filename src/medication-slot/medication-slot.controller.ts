import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { MedicationSlotService } from './medication-slot.service';
import { Parent, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('medication-slot')
export class MedicationSlotController {
  constructor(private readonly medicationSlotService: MedicationSlotService) {}

  @Post('child/:childId')
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createMedicationSlotDto: Prisma.MedicationSlotCreateInput,
    @CurrentUser() parent: Parent,
    @Param('childId') childId: string,
) {
  const childIdNumber = parseInt(childId, 10);
    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.medicationSlotService.create(createMedicationSlotDto,parent.parentId,childIdNumber);
  }

  @Get('child/:childId')
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser() parent :Parent,
    @Param('childId') childId: string,
  ) {
    const childIdNumber = parseInt(childId, 10);
    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.medicationSlotService.findAll(parent.parentId,childIdNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id') id: string,
    @CurrentUser() parent : Parent
) {
    return this.medicationSlotService.findOne(+id,parent.parentId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateMedicationSlotDto: Prisma.MedicationSlotUpdateInput,
    @CurrentUser() parent: Parent
  ) {
    return this.medicationSlotService.update(+id,parent.parentId, updateMedicationSlotDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @CurrentUser() parent: Parent
) {
    return this.medicationSlotService.remove(+id,parent.parentId);
  }
}
