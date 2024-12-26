import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { GrowthService } from './growth.service';
import { Parent, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { isValid, parseISO } from 'date-fns';
import { CreateGrowthDto } from './dto/create-growth-dto';
import { UpdateGrowthDto } from './dto/update-growth-dto';


@Controller('growth')
export class GrowthController {
  constructor(private readonly growthService: GrowthService) { }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createGrowthDto: CreateGrowthDto,
    @CurrentUser() parent: Parent,
  ) {

    return this.growthService.create(createGrowthDto, parent.parentId);
  }

  @Get(':childId/date-range')
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
    return this.growthService.getGrowthRecordsBetweenDates(parent.parentId, childIdNumber, startDate, endDate);
  }

  @Get('/:childId')
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Param('childId') childId: string,
    @CurrentUser() parent: Parent,
    @Query('limit') limit: string = '10', // Default limit
    @Query('offset') offset: string = '0' // Default offset
  ) {
    const childID = parseInt(childId, 10)
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

    return this.growthService.findAll(parent.parentId, childID, limitNum, offsetNum)

  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOne(
    @Param('id') id: Number,
    @CurrentUser() parent: Parent
  ) {
    return this.growthService.findOne(+id, parent.parentId)
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  async updateGrowth(
    @Param('id') id: string,
    @Body() updateGrowthDto: UpdateGrowthDto,
    @CurrentUser() parent: Parent,
  ) {
    const ID = parseInt(id, 10)
    if (isNaN(ID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.growthService.updateGrowthRecord(parent.parentId, ID, updateGrowthDto);
  }

  @Get('/delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteGrowth(
    @Param('id') id: string,
    @CurrentUser() parent: Parent,
  ) {
    const ID = parseInt(id, 10)
    if (isNaN(ID)) {
      throw new BadRequestException('Invalid Id format.');
    }
    return this.growthService.deleteGrowthRecord(parent.parentId, ID);
  }

  @Get('summary/:childId')
  @UseGuards(JwtAuthGuard)
  async summary(
    @Param('childId') childId,
    @CurrentUser() parent: Parent,
  ) {
    const childID = parseInt(childId, 10)
    if (isNaN(childID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.growthService.summary(parent.parentId, childID);
  }

  @Get('data/:childId')
  @UseGuards(JwtAuthGuard)
  async data(
    @Param('childId') childId,
    @CurrentUser() parent: Parent,
  ) {
    const childID = parseInt(childId, 10)
    if (isNaN(childID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.growthService.dataPoints(parent.parentId, childID);
  }

  @Get('height/summary/:childId')
  @UseGuards(JwtAuthGuard)
  async heightData(
    @Param('childId') childId,
    @CurrentUser() parent: Parent,
  ) {
    const childID = parseInt(childId, 10)
    if (isNaN(childID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.growthService.summaryHeight(parent.parentId, childID);
  }

  @Get('weight/summary/:childId')
  @UseGuards(JwtAuthGuard)
  async weightData(
    @Param('childId') childId,
    @CurrentUser() parent: Parent,
  ) {
    const childID = parseInt(childId, 10)
    if (isNaN(childID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.growthService.summaryWeight(parent.parentId, childID);
  }
}