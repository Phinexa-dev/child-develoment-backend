import { Test, TestingModule } from '@nestjs/testing';
import { PostSymptomService } from './post-symptom.service';

describe('PostSymptomService', () => {
  let service: PostSymptomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostSymptomService],
    }).compile();

    service = module.get<PostSymptomService>(PostSymptomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
