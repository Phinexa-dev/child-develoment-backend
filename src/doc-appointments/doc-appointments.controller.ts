import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { DocAppointmentsService } from './doc-appointments.service';
import { CreateAppointmentDto } from './dto/create-doc-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-doc-appointment.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Parent } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('doc-appointments')
export class DocAppointmentsController {
  constructor(private readonly docAppointmentsService: DocAppointmentsService) { }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser() parent: Parent,
  ) {
    return this.docAppointmentsService.create(createAppointmentDto, parent.parentId);
  }

  @Get(':childId')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Param('childId') childId: string,
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
    @CurrentUser() parent: Parent,
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

    return this.docAppointmentsService.findAll(parent.parentId, childID, limitNum, offsetNum);
  }


  @Post(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @CurrentUser() parent: Parent,
  ) {
    const appointmentId = parseInt(id, 10);
    if (isNaN(appointmentId)) {
      throw new BadRequestException('Invalid appointment ID format.');
    }

    return this.docAppointmentsService.update(appointmentId, updateAppointmentDto, parent.parentId);
  }

  @Get('/delete/:id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @CurrentUser() parent: Parent,
  ) {
    const appointmentId = parseInt(id, 10);
    if (isNaN(appointmentId)) {
      throw new BadRequestException('Invalid appointment ID format.');
    }

    return this.docAppointmentsService.delete(appointmentId, parent.parentId);
  }
}
