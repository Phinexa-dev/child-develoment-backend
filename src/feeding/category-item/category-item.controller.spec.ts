import { Test, TestingModule } from '@nestjs/testing';
import { CategoryItemController } from './category-item.controller';
import { CategoryItemService } from './category-item.service';

describe('CategoryItemController', () => {
  let controller: CategoryItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryItemController],
      providers: [CategoryItemService],
    }).compile();

    controller = module.get<CategoryItemController>(CategoryItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
