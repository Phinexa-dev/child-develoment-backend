import { Test, TestingModule } from '@nestjs/testing';
import { MedicineCusController } from './medicine-cus.controller';
import { MedicineCusService } from './medicine-cus.service';

describe('MedicineCusController', () => {
  let controller: MedicineCusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineCusController],
      providers: [MedicineCusService],
    }).compile();

    controller = module.get<MedicineCusController>(MedicineCusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
