
import { Transform } from 'class-transformer';
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
    @IsString()
    country?: string;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Transform(({ value }) =>
        Array.isArray(value) ? value.map(v => parseInt(v.toString(), 10)) : []
    )
    symptomIds?: number[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];
}
