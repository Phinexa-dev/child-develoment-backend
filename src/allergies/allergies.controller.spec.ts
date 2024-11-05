import { Test, TestingModule } from '@nestjs/testing';
import { AllergiesController } from './allergies.controller';
import { AllergiesService } from './allergies.service';

describe('AllergiesController', () => {
  let controller: AllergiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllergiesController],
      providers: [AllergiesService],
    }).compile();

    controller = module.get<AllergiesController>(AllergiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
