import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBottleDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Date must be provided' })
    @IsISO8601({}, { message: 'Invalid date format, expected ISO-8601 DateTime' })
    date: Date;
  
    @ApiProperty()
    @IsNotEmpty({ message: 'Time must be provided' })
    @IsISO8601({}, { message: 'Invalid time format, expected ISO-8601 DateTime' })
    time: Date;
  
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
  
    @ApiProperty()
    @IsNotEmpty({ message: 'Child ID must be provided' })
    @IsNumber({}, { message: 'Child ID must be a valid number' })
    childId: number;
  
    @ApiProperty()
    @IsNotEmpty({ message: 'Milk Type ID must be provided' })
    @IsNumber({}, { message: 'Milk Type ID must be a valid number' })
    milkTypeId: number;
  }