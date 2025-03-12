import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString, Min, ValidateNested } from "class-validator";

 export class CategoryCreateDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    numberOfUnits: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    unitOfMeasure: string

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    id: number;
}

export class CreateSolidDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    childId: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    reaction?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    note?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    dateTime: string;

    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategoryCreateDto)
    ingredients: CategoryCreateDto[];
}