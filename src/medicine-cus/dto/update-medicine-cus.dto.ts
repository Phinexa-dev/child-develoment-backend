import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicineCusDto } from './create-medicine-cus.dto';

export class UpdateMedicineCusDto extends PartialType(CreateMedicineCusDto) {}
