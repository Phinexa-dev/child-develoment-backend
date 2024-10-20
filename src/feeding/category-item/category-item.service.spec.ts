import { Test, TestingModule } from '@nestjs/testing';
import { CategoryItemService } from './category-item.service';

describe('CategoryItemService', () => {
  let service: CategoryItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryItemService],
    }).compile();

    service = module.get<CategoryItemService>(CategoryItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
