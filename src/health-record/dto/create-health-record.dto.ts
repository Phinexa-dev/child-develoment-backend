import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHealthRecordDto {
    @IsInt()
    @Transform(({ value }) => parseInt(value, 10))
    childId: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    file: any;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
