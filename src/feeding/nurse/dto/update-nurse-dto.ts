import { IsDateString, IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateNurseDto {
    @IsOptional()
    @IsDateString()
    startingTime?: string;
  
    @IsOptional()
    @IsDateString()
    endingTime?: string;
  
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
  
  }