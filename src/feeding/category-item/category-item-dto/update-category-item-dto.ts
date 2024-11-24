import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateCategoryItemDto {
    @IsOptional()
    @IsString()
    itemName?: string;
  
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;

    @IsString()
    @IsOptional()
    imagePath: string;
  }
  