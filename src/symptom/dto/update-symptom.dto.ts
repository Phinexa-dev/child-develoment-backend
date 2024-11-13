import { IsOptional, IsString } from "class-validator";

export class UpdateSymptomDto {
    @IsOptional()
    @IsString()
    name?: string;

  }