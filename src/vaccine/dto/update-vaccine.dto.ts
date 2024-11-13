import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateVaccineDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    region?: string;

    @IsOptional()
    @IsString()
    notes?: string; // Importance notes

    @IsOptional()
    @IsInt()
    @Min(0)
    ageInMonths?: number;

    @IsOptional()
    @IsString()
    whereTo?: string;

    @IsOptional()
    @IsString()
    period?: string;
}