import { Module } from '@nestjs/common';
import { MedicineCusService } from './medicine-cus.service';
import { MedicineCusController } from './medicine-cus.controller';

@Module({
  controllers: [MedicineCusController],
  providers: [MedicineCusService],
})
export class MedicineCusModule {}
