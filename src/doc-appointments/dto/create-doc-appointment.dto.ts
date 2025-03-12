import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateAppointmentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    doctor: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    date: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    note?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    venue: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    childId: number;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    appointmentNumber: number;
}
