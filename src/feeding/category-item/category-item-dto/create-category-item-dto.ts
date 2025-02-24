import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imagePath: string;

  @ApiPropertyOptional({ default: true })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean = true;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : null))
  @IsInt()
  @IsOptional()
  parentId?: number;
}

