import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateVaccineDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    region?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string; // Importance notes

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Min(0)
    ageInMonths?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    whereTo?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    period?: string;
}