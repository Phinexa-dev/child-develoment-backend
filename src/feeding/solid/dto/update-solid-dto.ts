import { Type } from "class-transformer";
import { IsArray, IsDateString, IsOptional, IsString, ValidateNested } from "class-validator";
import { CategoryCreateDto } from "./create-solid-dto";

export class UpdateSolidDto {
    @IsOptional()
    @IsString()
    reaction?: string;
  
    @IsOptional()
    @IsString()
    note?: string;
  
    @IsOptional()
    @IsDateString()
    dateTime?: string;
  
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CategoryCreateDto)
    ingredients: CategoryCreateDto[];
  }