import { Type } from "class-transformer";
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString, Min, ValidateNested } from "class-validator";

 export class CategoryCreateDto {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    numberOfUnits: number;

    @IsNotEmpty()
    @IsString()
    unitOfMeasure: string

    @IsNotEmpty()
    @IsInt()
    id: number;
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
    dateTime: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategoryCreateDto)
    ingredients: CategoryCreateDto[];
}