import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, Query } from '@nestjs/common';
import { NurseService } from './nurse.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Parent, Prisma } from '@prisma/client';
import { isValid, parseISO } from 'date-fns';
import { CreateNurseDto } from './dto/create-nurse-dto';
import { UpdateNurseDto } from './dto/update-nurse-dto';

@Controller('feeding/nursing')
export class NurseController {
  constructor(private readonly nurseService: NurseService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createNurseDto: CreateNurseDto,
    @CurrentUser() parent: Parent,
  ) {
    return this.nurseService.create(createNurseDto, parent.parentId);
  }

  @Get(':childId')
  @UseGuards(JwtAuthGuard)
  findAll(
    @Param('childId') childId: string,
    @CurrentUser() parent: Parent,
    @Query('limit') limit: string = '10', // Default limit
    @Query('offset') offset: string = '0' // Default offset
  ) {
    const childID = parseInt(childId, 10);
    if (isNaN(childID)) {
      throw new BadRequestException('Invalid childId format.');
    }

    const limitNum = parseInt(limit, 10);
    const offsetNum = parseInt(offset, 10);

    if (isNaN(limitNum) || limitNum <= 0) {
      throw new BadRequestException('Limit must be a positive integer.');
    }

    if (isNaN(offsetNum) || offsetNum < 0) {
      throw new BadRequestException('Offset must be a non-negative integer.');
    }

    return this.nurseService.findAll(parent.parentId, childID, limitNum, offsetNum);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string,
    @CurrentUser() parent: Parent) {
    return this.nurseService.findOne(+id, parent.parentId);
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

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateNurseDto: UpdateNurseDto,
    @CurrentUser() parent: Parent) {

    return this.nurseService.update(+id, updateNurseDto, parent.parentId);
  }

  @Get('delete/:id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @CurrentUser() parent: Parent) {
    return this.nurseService.remove(+id, parent.parentId);
  }
}