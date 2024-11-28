import { IsOptional, IsDateString, IsNumber, IsString } from 'class-validator';

export class UpdateGrowthDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
