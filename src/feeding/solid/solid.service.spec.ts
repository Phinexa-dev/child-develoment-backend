import { Test, TestingModule } from '@nestjs/testing';
import { SolidService } from './solid.service';

describe('SolidService', () => {
  let service: SolidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SolidService],
    }).compile();

    service = module.get<SolidService>(SolidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
