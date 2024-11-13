import { Test, TestingModule } from '@nestjs/testing';
import { PostSymptomController } from './post-symptom.controller';
import { PostSymptomService } from './post-symptom.service';

describe('PostSymptomController', () => {
  let controller: PostSymptomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostSymptomController],
      providers: [PostSymptomService],
    }).compile();

    controller = module.get<PostSymptomController>(PostSymptomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
