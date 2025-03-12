import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateVaccineDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    region: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string; // Importance notes

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    ageInMonths: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    whereTo?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    period?: string;

}
