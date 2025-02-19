import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto {
    @IsOptional()
    @IsString()
    doctor?: string;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsString()
    venue?: string;

    @IsOptional()
    @IsInt()
    appointmentNumber?: number;

}
