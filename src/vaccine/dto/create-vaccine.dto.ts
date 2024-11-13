import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateVaccineDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    region: string;

    @IsOptional()
    @IsString()
    notes?: string; // Importance notes

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    ageInMonths: number;

    @IsOptional()
    @IsString()
    whereTo?: string;

    @IsOptional()
    @IsString()
    period?: string;

}
