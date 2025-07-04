import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator";

export class CreateFeedbackDto {
    @ApiProperty()
    @IsString()
    lovedFeatures: string

    @ApiProperty()
    @IsString()
    wishToHaveFeatures: string

    @ApiProperty()
    @IsString()
    struggleToUseFeatures: string
  }