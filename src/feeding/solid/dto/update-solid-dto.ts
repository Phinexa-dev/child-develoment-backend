import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateSolidDto {
    @IsOptional()
    @IsString()
    reaction?: string;
  
    @IsOptional()
    @IsString()
    note?: string;
  
    @IsOptional()
    @IsDateString()
    date?: string;
  
    @IsOptional()
    @IsDateString()
    time?: string;
  }