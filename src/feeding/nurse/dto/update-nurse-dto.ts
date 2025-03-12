import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateNurseDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    date?: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    time?: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Min(0)
    leftDuration?: number;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Min(0)
    rightDuration?: number;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    childId?: number;
  }