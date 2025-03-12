import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateSleepDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    date: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    startTime: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    duration: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    note?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    sleepStyle?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    childId: number;
}
