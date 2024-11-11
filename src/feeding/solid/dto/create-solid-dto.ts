import { Type } from "class-transformer";
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from "class-validator";

class CategoryCreateDto {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    weightVolume: number;

    @IsNotEmpty()
    @IsInt()
    itemId: number;
}

export class CreateSolidDto {
    @IsNotEmpty()
    @IsInt()
    childId: number;

    @IsOptional()
    @IsString()
    reaction?: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsDateString()
    time: string;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CategoryCreateDto)
    categories: CategoryCreateDto[];
}