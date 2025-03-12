import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator";

export class CreateSymptomDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string
  }