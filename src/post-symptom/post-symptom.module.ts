import { Module } from '@nestjs/common';
import { PostSymptomService } from './post-symptom.service';
import { PostSymptomController } from './post-symptom.controller';

@Module({
  controllers: [PostSymptomController],
  providers: [PostSymptomService],
})
export class PostSymptomModule {}
