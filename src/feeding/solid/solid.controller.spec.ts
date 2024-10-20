import { Test, TestingModule } from '@nestjs/testing';
import { SolidController } from './solid.controller';
import { SolidService } from './solid.service';

describe('SolidController', () => {
  let controller: SolidController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolidController],
      providers: [SolidService],
    }).compile();

    controller = module.get<SolidController>(SolidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
