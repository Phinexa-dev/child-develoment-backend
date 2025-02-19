import { IsOptional, IsString, IsDateString } from 'class-validator';


export class UpdateHealthRecordDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    file?: any;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
