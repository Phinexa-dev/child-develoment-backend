import { Module } from '@nestjs/common';
import { DocAppointmentsService } from './doc-appointments.service';
import { DocAppointmentsController } from './doc-appointments.controller';

@Module({
  controllers: [DocAppointmentsController],
  providers: [DocAppointmentsService],
})
export class DocAppointmentsModule {}
