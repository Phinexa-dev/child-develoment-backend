import { Module } from '@nestjs/common';
import { BottleService } from './bottle.service';
import { BottleController } from './bottle.controller';

@Module({
  controllers: [BottleController],
  providers: [BottleService],
})
export class BottleModule {}
