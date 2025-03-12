import { Type } from "class-transformer";
import { IsArray, IsDateString, IsOptional, IsString, ValidateNested } from "class-validator";
import { CategoryCreateDto } from "./create-solid-dto";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateSolidDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    reaction?: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    note?: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    dateTime?: string;
  
    @ApiPropertyOptional()
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CategoryCreateDto)
    ingredients: CategoryCreateDto[];
  }