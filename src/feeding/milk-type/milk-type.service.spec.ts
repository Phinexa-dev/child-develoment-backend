import { Test, TestingModule } from '@nestjs/testing';
import { MilkTypeService } from './milk-type.service';

describe('MilkTypeService', () => {
  let service: MilkTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MilkTypeService],
    }).compile();

    service = module.get<MilkTypeService>(MilkTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
