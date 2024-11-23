import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateNurseDto {
    @IsDateString()
    startingTime: string;

    @IsDateString()
    endingTime: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    leftDuration?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    rightDuration?: number;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsNotEmpty()
    @IsInt()
    childId: number;
}

