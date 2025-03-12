import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsInt, IsOptional, IsBoolean } from "class-validator";

export class CreatePostSymptomDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    vaccinationId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    symptomId: number;
  }