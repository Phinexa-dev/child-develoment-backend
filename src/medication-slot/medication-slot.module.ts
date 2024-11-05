import { Module } from '@nestjs/common';
import { MedicationSlotService } from './medication-slot.service';
import { MedicationSlotController } from './medication-slot.controller';

@Module({
  controllers: [MedicationSlotController],
  providers: [MedicationSlotService],
})
export class MedicationSlotModule {}
