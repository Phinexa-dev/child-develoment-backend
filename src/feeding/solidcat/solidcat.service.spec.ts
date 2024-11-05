import { Test, TestingModule } from '@nestjs/testing';
import { SolidcatService } from './solidcat.service';

describe('SolidcatService', () => {
  let service: SolidcatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SolidcatService],
    }).compile();

    service = module.get<SolidcatService>(SolidcatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
