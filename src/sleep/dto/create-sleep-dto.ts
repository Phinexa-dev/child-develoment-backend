import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateSleepDto {
    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsDateString()
    startTime: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    duration: number;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsString()
    sleepStyle?: string;

    @IsNotEmpty()
    @IsInt()
    childId: number;
}
