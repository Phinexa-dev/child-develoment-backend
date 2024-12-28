import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-doc-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-doc-appointment.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DocAppointmentsService {

  constructor(private readonly databaseService: DatabaseService) { }

  private async verifyParentChildRelation(parentId: number, childId: number) {
    const parentChildRelation = await this.databaseService.parentChild.findFirst({
      where: {
        parentId: parentId,
        childId: childId,
        status: 'Active',
      },
    });

    if (!parentChildRelation) {
      throw new UnauthorizedException('This child does not belong to the authenticated parent.');
    }
  }

  async create(createAppointmentDto: CreateAppointmentDto, parentId: number) {
    await this.verifyParentChildRelation(parentId, createAppointmentDto.childId);

    return this.databaseService.appointments.create({
      data: {
        doctor: createAppointmentDto.doctor,
        date: createAppointmentDto.date,
        note: createAppointmentDto.note,
        venue: createAppointmentDto.venue,
        appointmentNumber: createAppointmentDto.appointmentNumber,
        child: {
          connect: { childId: createAppointmentDto.childId },
        },
      },
    });
  }

  async findAll(parentId: number, childId: number, limit: number, offset: number) {
    await this.verifyParentChildRelation(parentId, childId);

    return this.databaseService.appointments.findMany({
      where: {
        childId,
        isDeleted: false,
      },
      select: {
        id: true,
        doctor: true,
        date: true,
        note: true,
        venue: true,
        appointmentNumber: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
      skip: offset,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} docAppointment`;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto, parentId: number) {
    const appointment = await this.databaseService.appointments.findUnique({
      where: { id, isDeleted: false },
    });

    if (!appointment || appointment.isDeleted) {
      throw new NotFoundException('Appointment not found.');
    }

    await this.verifyParentChildRelation(parentId, appointment.childId);

    return this.databaseService.appointments.update({
      where: { id },
      data: {
        doctor: updateAppointmentDto.doctor,
        date: updateAppointmentDto.date,
        note: updateAppointmentDto.note,
        venue: updateAppointmentDto.venue,
        appointmentNumber: updateAppointmentDto.appointmentNumber
      },
    });
  }


  async delete(id: number, parentId: number) {
    const appointment = await this.databaseService.appointments.findUnique({
      where: { id, isDeleted: false },
    });

    if (!appointment || appointment.isDeleted) {
      throw new NotFoundException('Appointment not found.');
    }

    await this.verifyParentChildRelation(parentId, appointment.childId);

    return this.databaseService.appointments.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
