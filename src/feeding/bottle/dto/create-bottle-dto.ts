import { IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBottleDto {
    
    @IsNotEmpty({ message: 'Date must be provided' })
    @IsISO8601({}, { message: 'Invalid date format, expected ISO-8601 DateTime' })
    date: Date;
  
    @IsNotEmpty({ message: 'Time must be provided' })
    @IsISO8601({}, { message: 'Invalid time format, expected ISO-8601 DateTime' })
    time: Date;
  
    @IsOptional()
    @IsNumber({}, { message: 'Volume must be a valid number' })
    volume?: number;
  
    @IsOptional()
    @IsString()
    stash?: string;
  
    @IsOptional()
    @IsString()
    notes?: string;
  
    @IsNotEmpty({ message: 'Child ID must be provided' })
    @IsNumber({}, { message: 'Child ID must be a valid number' })
    childId: number;
  
    @IsNotEmpty({ message: 'Milk Type ID must be provided' })
    @IsNumber({}, { message: 'Milk Type ID must be a valid number' })
    milkTypeId: number;
  }