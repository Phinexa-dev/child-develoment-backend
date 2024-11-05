import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, Query } from '@nestjs/common';
import { SolidService } from './solid.service';
import { Parent, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { isValid, parseISO } from 'date-fns';

@Controller('solid')
export class SolidController {
  constructor(private readonly solidService: SolidService) { }

  @Post('child/:childId')
  @UseGuards(JwtAuthGuard)
  create(@Body() createSolidDto: Prisma.SolidsCreateInput,
    @CurrentUser() parent: Parent,
    @Param('childId') childId: string) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }
    if (!createSolidDto.child) {
      createSolidDto.child = {
        connect: { childId: childIdNumber },
      };
    } else {
      createSolidDto.child.connect = { childId: childIdNumber };
    }
    return this.solidService.create(createSolidDto, parent.parentId);
  }

  @Get('child/:childId')
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() parent: Parent,
    @Param('childId') childId: string) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.solidService.findAll(parent.parentId, childIdNumber);
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string,
    @Body() updateSolidDto: Prisma.SolidsUpdateInput,
    @CurrentUser() parent: Parent) {
    return this.solidService.update(+id, parent.parentId, updateSolidDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string,
    @CurrentUser() parent: Parent) {
    return this.solidService.remove(+id, parent.parentId);
  }
}
