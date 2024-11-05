import { Test, TestingModule } from '@nestjs/testing';
import { AllergiesService } from './allergies.service';

describe('AllergiesService', () => {
  let service: AllergiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllergiesService],
    }).compile();

    service = module.get<AllergiesService>(AllergiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
