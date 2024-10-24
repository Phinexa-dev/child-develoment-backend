import { Test, TestingModule } from '@nestjs/testing';
import { SolidcatController } from './solidcat.controller';
import { SolidcatService } from './solidcat.service';

describe('SolidcatController', () => {
  let controller: SolidcatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolidcatController],
      providers: [SolidcatService],
    }).compile();

    controller = module.get<SolidcatController>(SolidcatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
