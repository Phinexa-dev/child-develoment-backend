import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateSymptomDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

  }