import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateGrowthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  weight: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  height: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  childId: number; 
}
