import { IsNotEmpty, IsOptional, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateGrowthDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsNumber()
  weight: number;

  @IsOptional()
  @IsNumber()
  height: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsNotEmpty()
  @IsNumber()
  childId: number; 
}
