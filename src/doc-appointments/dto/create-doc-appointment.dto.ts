import { IsDateString, IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsString()
    doctor: string;

    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsNotEmpty()
    @IsString()
    venue: string;

    @IsNotEmpty()
    @IsInt()
    childId: number;
}
