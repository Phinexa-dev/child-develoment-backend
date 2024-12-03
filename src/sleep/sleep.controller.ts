import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, Query } from '@nestjs/common';
import { SleepService } from './sleep.service';
import { Parent, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { isValid, parseISO } from 'date-fns';


@Controller('sleep')
export class SleepController {
  constructor(private readonly sleepService: SleepService) { }

  @Post('child/:childId')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createSleepDto: Prisma.SleepCreateInput,
    @CurrentUser() parent: Parent,
    @Param('childId') childId: string,
  ) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }
    if (!createSleepDto.child) {
      createSleepDto.child = {
        connect: { childId: childIdNumber },
      };
    } else {
      createSleepDto.child.connect = { childId: childIdNumber };
    }
    return this.sleepService.create(createSleepDto, parent.parentId);
  }

  @Get('child/:childId/date-range')
  @UseGuards(JwtAuthGuard)
  async getSleepRecordsBetweenDates(
    @Param('childId') childId: string,
    @Query('start') start: string,
    @Query('end') end: string,
    @CurrentUser() parent: Parent,
  ) {
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
    return this.sleepService.getSleepRecordsBetweenDates(parent.parentId, childIdNumber, startDate, endDate);
  }

  @Get('child/:childId')
  @UseGuards(JwtAuthGuard)
  async getAllSleepRecords(
    @Param('childId') childId: string,
    @CurrentUser() parent: Parent,
  ) {
    const childID = parseInt(childId, 10);

    if (isNaN(childID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.sleepService.findAll(parent.parentId, childID);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateSleepRecord(
    @Param('id') id: string,
    @Body() updateSleepDto: Prisma.SleepUpdateInput,
    @CurrentUser() parent: Parent,
  ) {
    const ID = parseInt(id, 10);
    if (isNaN(ID)) {
      throw new BadRequestException('Invalid ID format.');
    }
    return this.sleepService.updateSleepRecord(parent.parentId, ID, updateSleepDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteSleepRecord(
    @Param('id') id: string,
    @CurrentUser() parent: Parent,
  ) {
    const ID = parseInt(id, 10);
    if (isNaN(ID)) {
      throw new BadRequestException('Invalid ID format.');
    }
    return this.sleepService.deleteSleepRecord(parent.parentId, ID);
  }

  @Get('summary/:childId')
  @UseGuards(JwtAuthGuard)
  summary(
    @Param('childId') childId: string,
    @CurrentUser() parent: Parent) {
    const childID = parseInt(childId, 10)
    if (isNaN(childID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.sleepService.summary(parent.parentId, +childId);
  }
}
