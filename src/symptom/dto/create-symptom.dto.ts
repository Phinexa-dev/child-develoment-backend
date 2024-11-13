import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator";

export class CreateSymptomDto {
    @IsNotEmpty()
    @IsString()
    name: string
  }