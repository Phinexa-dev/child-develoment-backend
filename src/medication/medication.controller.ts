import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Parent, Prisma } from '@prisma/client';

@Controller('medication')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) { }

  @Post('child/:childId')
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createMedicationDto: Prisma.MedicationCreateInput,
    @CurrentUser() parent: Parent,
    @Param('childId') childId: string,
  ) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }

    if (!createMedicationDto.child) {
      createMedicationDto.child = {
        connect: { childId: childIdNumber },
      };
    } else {
      createMedicationDto.child.connect = { childId: childIdNumber };
    }
    return this.medicationService.create(createMedicationDto, parent.parentId);
  }

  @Get('child/:childId')
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser() parent: Parent,
    @Param('childId') childId: string
  ) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.medicationService.findAll(parent.parentId, childIdNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id') id: string,
    @CurrentUser() parent: Parent,
  ) {
    return this.medicationService.findOne(+id,parent.parentId,);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @CurrentUser() parent: Parent,
    @Body() updateMedicationDto: Prisma.MedicationUpdateInput) {
    return this.medicationService.update(+id, updateMedicationDto,parent.parentId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
  @Param('id') id: string,
  @CurrentUser() parent: Parent,) {
    return this.medicationService.remove(+id,parent.parentId);
  }
}
