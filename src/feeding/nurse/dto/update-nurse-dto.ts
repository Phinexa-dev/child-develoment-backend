import { IsDateString, IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateNurseDto {
    @IsOptional()
    @IsDateString()
    date?: string;
  
    @IsOptional()
    @IsDateString()
    time?: string;
  
    @IsOptional()
    @IsInt()
    @Min(0)
    leftDuration?: number;
  
    @IsOptional()
    @IsInt()
    @Min(0)
    rightDuration?: number;
  
    @IsOptional()
    @IsString()
    notes?: string;
  
    @IsOptional()
    @IsInt()
    childId?: number;
  }