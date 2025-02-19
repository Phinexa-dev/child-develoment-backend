import { Module } from '@nestjs/common';
import { HealthRecordService } from './health-record.service';
import { HealthRecordController } from './health-record.controller';

@Module({
  controllers: [HealthRecordController],
  providers: [HealthRecordService],
})
export class HealthRecordModule {}
