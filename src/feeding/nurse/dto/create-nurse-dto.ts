import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateNurseDto {
    @ApiProperty()
    @IsDateString()
    startingTime: string;

    @ApiProperty()
    @IsDateString()
    endingTime: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Min(0)
    leftDuration?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Min(0)
    rightDuration?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    childId: number;
}

