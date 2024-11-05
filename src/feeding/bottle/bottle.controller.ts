import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, Query } from '@nestjs/common';
import { BottleService } from './bottle.service';
import { Parent, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { isValid, parseISO } from 'date-fns';

@Controller('bottle')
export class BottleController {
  constructor(private readonly bottleService: BottleService) { }

  @Post('child/:childId')
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createBottleDto: Prisma.BottleCreateInput,
    @CurrentUser() parent: Parent,
    @Param('childId') childId: string
  ) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }
    if (!createBottleDto.child) {
      createBottleDto.child = {
        connect: { childId: childIdNumber },
      };
    } else {
      createBottleDto.child.connect = { childId: childIdNumber };
    }

    return this.bottleService.create(createBottleDto, parent.parentId);
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
    return this.bottleService.findAll(parent.parentId, childIdNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id') id: string,
    @CurrentUser() parent: Parent
  ) {
    const recID = parseInt(id, 10)
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid id format.');
    }
    return this.bottleService.findOne(recID, parent.parentId);
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
    return this.bottleService.getBottleRecordsBetweenDates(parent.parentId, childIdNumber, startDate, endDate);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateBottleDto: Prisma.BottleUpdateInput,
    @CurrentUser() parent: Parent
  ) {
    const recID = parseInt(id, 10)
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid id format.');
    }
    return this.bottleService.update(recID, updateBottleDto, parent.parentId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @CurrentUser() parent: Parent
  ) {
    const recID = parseInt(id, 10)
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.bottleService.remove(recID, parent.parentId);
  }
}
