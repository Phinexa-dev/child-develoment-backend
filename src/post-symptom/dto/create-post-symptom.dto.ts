import { IsNotEmpty, IsInt, IsOptional, IsBoolean } from "class-validator";

export class CreatePostSymptomDto {
    @IsNotEmpty()
    @IsInt()
    vaccinationId: number;
  
    @IsNotEmpty()
    @IsInt()
    symptomId: number;
  }