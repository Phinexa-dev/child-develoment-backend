import { Test, TestingModule } from '@nestjs/testing';
import { MedicationSlotService } from './medication-slot.service';

describe('MedicationSlotService', () => {
  let service: MedicationSlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicationSlotService],
    }).compile();

    service = module.get<MedicationSlotService>(MedicationSlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
