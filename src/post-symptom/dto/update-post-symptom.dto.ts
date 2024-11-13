import { PartialType } from '@nestjs/mapped-types';
import { CreatePostSymptomDto } from './create-post-symptom.dto';

export class UpdatePostSymptomDto extends PartialType(CreatePostSymptomDto) {}
