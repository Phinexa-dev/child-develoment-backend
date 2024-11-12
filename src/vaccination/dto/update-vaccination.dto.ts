
import { IsArray, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateVaccinationDto {

    @IsOptional()
    @IsDateString()
    date?: Date;

    @IsOptional()
    @IsString()
    venue?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    symptomIds?: number[];
}
