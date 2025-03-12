import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsISO8601, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateBottleDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsISO8601({}, { message: 'Invalid date format, expected ISO-8601 DateTime' })
    date?: Date;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsISO8601({}, { message: 'Invalid time format, expected ISO-8601 DateTime' })
    time?: Date;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber({}, { message: 'Volume must be a valid number' })
    volume?: number;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    stash?: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber({}, { message: 'Milk Type ID must be a valid number' })
    milkTypeId?: number;
  }