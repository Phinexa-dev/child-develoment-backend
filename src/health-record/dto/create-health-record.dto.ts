import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateHealthRecordDto {
    @IsInt()
    @Transform(({ value }) => parseInt(value, 10))
    childId: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    file: any;
}
