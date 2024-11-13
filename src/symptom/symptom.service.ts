import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { UpdateSymptomDto } from './dto/update-symptom.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SymptomService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createSymptomDto: CreateSymptomDto) {

    const existingSymptom = await this.databaseService.symptom.findFirst({
      where: {
        name: {
          equals: createSymptomDto.name,
          mode: 'insensitive',
        }
      },
    });

    if (existingSymptom) {
      throw new BadRequestException(`Symptom with name "${createSymptomDto.name}" already exists.`);
    }

    return this.databaseService.symptom.create({
      data: createSymptomDto
    });
  }


  async findAll() {
    return this.databaseService.symptom.findMany({
      where: { isDeleted: false },
      select: { id: true, name: true }
    });
  }

  async findOne(id: number) {
    const symptom = await this.databaseService.symptom.findUnique({
      where: { id, isDeleted: false },
    });

    if (!symptom) {
      throw new NotFoundException(`Symptom with ID ${id} not found.`);
    }

    return symptom;
  }

  async update(id: number, updateSymptomDto: UpdateSymptomDto) {
    const symptom = await this.databaseService.symptom.findUnique({
      where: { id, isDeleted: false },
    });

    if (!symptom) {
      throw new NotFoundException(`Symptom with ID ${id} not found.`);
    }

    return this.databaseService.symptom.update({
      where: { id },
      data: updateSymptomDto,
    });
  }

  async remove(id: number) {
    const symptom = await this.databaseService.symptom.findUnique({
      where: { id, isDeleted: false },
    });

    if (!symptom) {
      throw new NotFoundException(`Symptom with ID ${id} not found.`);
    }

    return this.databaseService.symptom.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
