import { Test, TestingModule } from '@nestjs/testing';
import { MilkTypeController } from './milk-type.controller';
import { MilkTypeService } from './milk-type.service';

describe('MilkTypeController', () => {
  let controller: MilkTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MilkTypeController],
      providers: [MilkTypeService],
    }).compile();

    controller = module.get<MilkTypeController>(MilkTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
