import { Test, TestingModule } from '@nestjs/testing';
import { BottleController } from './bottle.controller';
import { BottleService } from './bottle.service';

describe('BottleController', () => {
  let controller: BottleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BottleController],
      providers: [BottleService],
    }).compile();

    controller = module.get<BottleController>(BottleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
