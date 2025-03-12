import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHealthRecordDto {
    @ApiProperty()
    @IsInt()
    @Transform(({ value }) => parseInt(value, 10))
    childId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    file: any;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;
}
