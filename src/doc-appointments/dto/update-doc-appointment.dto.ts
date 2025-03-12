import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    doctor?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    note?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    venue?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    appointmentNumber?: number;

}
