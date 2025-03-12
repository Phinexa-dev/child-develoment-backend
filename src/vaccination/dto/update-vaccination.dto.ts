
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateVaccinationDto {

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    date?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    venue?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    country?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Transform(({ value }) =>
        Array.isArray(value) ? value.map(v => parseInt(v.toString(), 10)) : []
    )
    symptomIds?: number[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];
}
