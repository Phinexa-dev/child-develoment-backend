import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateCategoryItemDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    itemName?: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;

    @ApiProperty()
    @IsString()
    @IsOptional()
    imagePath: string;
  }
  