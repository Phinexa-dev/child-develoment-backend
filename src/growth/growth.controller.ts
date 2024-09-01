import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { GrowthService } from './growth.service';
import { Parent, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { isDataURI, IsDate } from 'class-validator';
import { isValid, parseISO } from 'date-fns';


@Controller('growth')
export class GrowthController {
  constructor(private readonly growthService: GrowthService) {}

  @Post('child/:childId')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createGrowthDto: Prisma.GrowthCreateInput,
    @CurrentUser() parent: Parent,
    @Param('childId') childId: string,
  ) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }

    if (!createGrowthDto.child) {
      createGrowthDto.child = {
        connect: { childId: childIdNumber },
      };
    } else {
      createGrowthDto.child.connect = { childId: childIdNumber };
    }

    return this.growthService.create(createGrowthDto, parent.parentId);
  }
  @Get('child/:childId/date-range')
  @UseGuards(JwtAuthGuard)
  async getGrowthRecordsBetweenDates(
    @Param('childId') childId: string, 
    @Query('start') start: string,
    @Query('end') end: string,
    @CurrentUser() parent: Parent,) 
    {
 
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
  @Get('child/:childId')
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Param('childId') childId: string,
    @CurrentUser() parent : Parent
  ){
    const childID = parseInt(childId,10)
    if (isNaN(childID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.growthService.findAll(parent.parentId,childID)

  }
  

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateGrowth(
    @Param('id') id: string,
    @Body() updateGrowthDto: Prisma.GrowthUpdateInput,
    @CurrentUser() parent: Parent,
  ) {
    const ID = parseInt(id,10)
    if (isNaN(ID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.growthService.updateGrowthRecord(parent.parentId, ID, updateGrowthDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteGrowth(
    @Param('id') id: string,
    @CurrentUser() parent: Parent,
  ) {
    const ID = parseInt(id,10)
    if (isNaN(ID)) {
      throw new BadRequestException('Invalid Id format.');
    }
    return this.growthService.deleteGrowthRecord(parent.parentId, ID);
  }

  // TODO : delete by the date if needed
}
