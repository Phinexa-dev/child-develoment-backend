import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MedicineService {
  constructor (private readonly databaseService: DatabaseService){}

  async create(createMedicineDto: Prisma.MedicineDefCreateInput) {
    if (!createMedicineDto.name || createMedicineDto.name.trim() === '') {
      throw new BadRequestException('Name is required and cannot be empty.');
    }
    if (!createMedicineDto.description || createMedicineDto.description.trim() === '') {
      throw new BadRequestException('Description is required and cannot be empty.');
    }
    if (!createMedicineDto.form || createMedicineDto.form.trim() === '') {
      throw new BadRequestException('Form is required and cannot be empty.');
    }
  
    return await this.databaseService.medicineDef.create({
      data: {
        ...createMedicineDto,
        medicine: createMedicineDto.medicine ?? { create: {} },
      },
    });
  }
  async findAll() {
    return await this.databaseService.medicineDef.findMany({});
  }

  async findOne(id: number) {
    var defMedicne = await this.databaseService.medicineDef.findUnique({
      where:{
        medID:id
      }
    })
    if(defMedicne==null){
      throw new NotFoundException("medicine with that id not found")
    }
    return defMedicne
  }

  async update(id: number, updateMedicineDto: Prisma.MedicineDefUpdateInput) {
    const existingMedicine = await this.databaseService.medicineDef.findUnique({
      where: { medID: id },
    });
  
    if (!existingMedicine) {
      throw new NotFoundException(`Medicine with ID ${id} not found.`);
    }
  
    if (updateMedicineDto.name && typeof updateMedicineDto.name === 'string' && updateMedicineDto.name.trim() === '') {
      throw new BadRequestException('Name cannot be empty.');
    } else if (
      updateMedicineDto.name &&
      typeof updateMedicineDto.name !== 'string' &&
      updateMedicineDto.name.set?.trim() === ''
    ) {
      throw new BadRequestException('Name cannot be empty.');
    }
  
    if (updateMedicineDto.description && typeof updateMedicineDto.description === 'string' && updateMedicineDto.description.trim() === '') {
      throw new BadRequestException('Description cannot be empty.');
    } else if (
      updateMedicineDto.description &&
      typeof updateMedicineDto.description !== 'string' &&
      updateMedicineDto.description.set?.trim() === ''
    ) {
      throw new BadRequestException('Description cannot be empty.');
    }
  
    if (updateMedicineDto.form && typeof updateMedicineDto.form === 'string' && updateMedicineDto.form.trim() === '') {
      throw new BadRequestException('Form cannot be empty.');
    } else if (
      updateMedicineDto.form &&
      typeof updateMedicineDto.form !== 'string' &&
      updateMedicineDto.form.set?.trim() === ''
    ) {
      throw new BadRequestException('Form cannot be empty.');
    }
    return await this.databaseService.medicineDef.update({
      where: { medID: id },
      data: updateMedicineDto,
    });
  }
  
  async remove(id: number) {
    const existingMedicine = await this.databaseService.medicineDef.findUnique({
      where: { medID: id },
    });
  
    if (!existingMedicine) {
      throw new NotFoundException(`Medicine with ID ${id} not found.`);
    }

    return await this.databaseService.medicineDef.delete({
      where: { medID: id },
    });
  }
}
