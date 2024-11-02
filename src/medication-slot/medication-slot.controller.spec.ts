import { Test, TestingModule } from '@nestjs/testing';
import { MedicationSlotController } from './medication-slot.controller';
import { MedicationSlotService } from './medication-slot.service';

describe('MedicationSlotController', () => {
  let controller: MedicationSlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicationSlotController],
      providers: [MedicationSlotService],
    }).compile();

    controller = module.get<MedicationSlotController>(MedicationSlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
