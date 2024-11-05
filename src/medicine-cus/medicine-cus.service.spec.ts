import { Test, TestingModule } from '@nestjs/testing';
import { MedicineCusService } from './medicine-cus.service';

describe('MedicineCusService', () => {
  let service: MedicineCusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicineCusService],
    }).compile();

    service = module.get<MedicineCusService>(MedicineCusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
