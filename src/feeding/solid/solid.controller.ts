import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, Query } from '@nestjs/common';
import { SolidService } from './solid.service';
import { Parent, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { isValid, parseISO } from 'date-fns';
import { CreateSolidDto } from './dto/create-solid-dto';
import { UpdateSolidDto } from './dto/update-solid-dto';

@Controller('feeding/solid')
export class SolidController {
  constructor(private readonly solidService: SolidService) { }

  @Post('')
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createSolidDto: CreateSolidDto,
    @CurrentUser() parent: Parent,
  ) {
    return this.solidService.create(createSolidDto, parent.parentId);
  }

  @Get(':childId')
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser() parent: Parent,
    @Param('childId') childId: string,
    @Query('limit') limit: string = '10', // Default limit
    @Query('offset') offset: string = '0' // Default offset
  ) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
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
    return this.solidService.findAll(parent.parentId, childIdNumber, limitNum, offsetNum);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string,
    @CurrentUser() parent: Parent) {
    return this.solidService.findOne(parent.parentId, +id);
  }

  @Get('/child/:childId/date-range')
  @UseGuards(JwtAuthGuard)
  async getSolidRecordsBetweenDates(
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

    return this.solidService.getSolidRecordsBetweenDates(parent.parentId, childIdNumber, startDate, endDate);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateSolidDto: UpdateSolidDto,
    @CurrentUser() parent: Parent) {
    return this.solidService.update(+id, parent.parentId, updateSolidDto);
  }

  @Get('delete/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string,
    @CurrentUser() parent: Parent) {
    return this.solidService.remove(+id, parent.parentId);
  }
}
