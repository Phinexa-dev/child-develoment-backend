import { Test, TestingModule } from '@nestjs/testing';
import { DocAppointmentsService } from './doc-appointments.service';

describe('DocAppointmentsService', () => {
  let service: DocAppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocAppointmentsService],
    }).compile();

    service = module.get<DocAppointmentsService>(DocAppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
