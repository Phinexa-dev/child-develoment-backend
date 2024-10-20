import { PartialType } from '@nestjs/mapped-types';
import { CreateSolidDto } from './create-solid.dto';

export class UpdateSolidDto extends PartialType(CreateSolidDto) {}
