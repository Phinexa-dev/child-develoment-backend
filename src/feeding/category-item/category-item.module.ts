import { Module } from '@nestjs/common';
import { CategoryItemService } from './category-item.service';
import { CategoryItemController } from './category-item.controller';

@Module({
  controllers: [CategoryItemController],
  providers: [CategoryItemService],
})
export class CategoryItemModule {}
