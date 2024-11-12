import { IsISO8601, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateBottleDto {
    
    @IsOptional()
    @IsISO8601({}, { message: 'Invalid date format, expected ISO-8601 DateTime' })
    date?: Date;
  
    @IsOptional()
    @IsISO8601({}, { message: 'Invalid time format, expected ISO-8601 DateTime' })
    time?: Date;
  
    @IsOptional()
    @IsNumber({}, { message: 'Volume must be a valid number' })
    volume?: number;
  
    @IsOptional()
    @IsString()
    stash?: string;
  
    @IsOptional()
    @IsString()
    notes?: string;
  
    @IsOptional()
    @IsNumber({}, { message: 'Milk Type ID must be a valid number' })
    milkTypeId?: number;
  }