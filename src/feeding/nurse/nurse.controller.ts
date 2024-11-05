import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, Query } from '@nestjs/common';
import { NurseService } from './nurse.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Parent, Prisma } from '@prisma/client';
import { isValid, parseISO } from 'date-fns';

@Controller('nurse')
export class NurseController {
  constructor(private readonly nurseService: NurseService) { }

  @Post('child/:childId')
  @UseGuards(JwtAuthGuard)
  create(@Body() createNurseDto: Prisma.NursingCreateInput,
    @CurrentUser() parent: Parent,
    @Param('childId') childId: string,) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }

    if (!createNurseDto.child) {
      createNurseDto.child = {
        connect: { childId: childIdNumber },
      };
    } else {
      createNurseDto.child.connect = { childId: childIdNumber };
    }
    return this.nurseService.create(createNurseDto, parent.parentId);
  }

  @Get("child/:childId")
  @UseGuards(JwtAuthGuard)
  findAll(
    @Param('childId') childId: string,
    @CurrentUser() parent: Parent
  ) {
    const childID = parseInt(childId, 10)
    if (isNaN(childID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.nurseService.findAll(parent.parentId, childID)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string,
    @CurrentUser() parent: Parent) {
    const recID = parseInt(id, 10)
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.nurseService.findOne(recID, parent.parentId);
  }

  @Get('child/:childId/date-range')
  @UseGuards(JwtAuthGuard)
  async getGrowthRecordsBetweenDates(
    @Param('childId') childId: string,
    @Query('start') start: string,
    @Query('end') end: string,
    @CurrentUser() parent: Parent,) {

    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }
    const startDate = parseISO(start);
    const endDate = parseISO(end);

    if (!isValid(startDate) || !isValid(endDate)) {
      throw new BadRequestException('Invalid date format. Dates must be in ISO-8601 format.');
    }
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date.');
    }
    return this.nurseService.getNurseRecordsBetweenDates(parent.parentId, childIdNumber, startDate, endDate);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string,
    @Body() updateNurseDto: Prisma.NursingUpdateInput,
    @CurrentUser() parent: Parent) {
    const recID = parseInt(id, 10)
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.nurseService.update(recID, updateNurseDto, parent.parentId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string,
    @CurrentUser() parent: Parent) {
    const recID = parseInt(id, 10)
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.nurseService.remove(recID, parent.parentId);
  }
}