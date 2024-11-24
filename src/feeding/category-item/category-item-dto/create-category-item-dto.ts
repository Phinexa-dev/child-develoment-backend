import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryItemDto {
  @IsNotEmpty()
  @IsString()
  itemName: string;

  @IsNotEmpty()
  @IsBoolean()
  isDefault: boolean;

  @IsNotEmpty()
  categoryId: number;

  @IsString()
  @IsOptional()
  imagePath: string;
}

