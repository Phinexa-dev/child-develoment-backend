import { Module } from '@nestjs/common';
import { SolidcatService } from './solidcat.service';
import { SolidcatController } from './solidcat.controller';

@Module({
  controllers: [SolidcatController],
  providers: [SolidcatService],
})
export class SolidcatModule {}
