import { IsArray, IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateVaccinationDto {
  @IsNotEmpty()
  @IsInt()
  childId: number;

  @IsNotEmpty()
  @IsInt()
  vaccineId?: number;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsString()
  venue: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  symptomIds?: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[]
}
