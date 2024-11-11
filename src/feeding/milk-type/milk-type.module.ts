import { Module } from '@nestjs/common';
import { MilkTypeService } from './milk-type.service';
import { MilkTypeController } from './milk-type.controller';

@Module({
  controllers: [MilkTypeController],
  providers: [MilkTypeService],
})
export class MilkTypeModule {}
