import { Test, TestingModule } from '@nestjs/testing';
import { DocAppointmentsController } from './doc-appointments.controller';
import { DocAppointmentsService } from './doc-appointments.service';

describe('DocAppointmentsController', () => {
  let controller: DocAppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocAppointmentsController],
      providers: [DocAppointmentsService],
    }).compile();

    controller = module.get<DocAppointmentsController>(DocAppointmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
