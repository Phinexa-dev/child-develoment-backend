import { Test, TestingModule } from '@nestjs/testing';
import { VaccinationController } from './vaccination.controller';
import { VaccinationService } from './vaccination.service';

describe('VaccinationController', () => {
  let controller: VaccinationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaccinationController],
      providers: [VaccinationService],
    }).compile();

    controller = module.get<VaccinationController>(VaccinationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
