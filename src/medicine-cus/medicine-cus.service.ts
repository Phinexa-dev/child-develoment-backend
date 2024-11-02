import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';


@Injectable()
export class MedicineCusService {
  constructor (private readonly databaseService: DatabaseService){}

  async create(createMedicineCusDto: Prisma.MedicineCusCreateInput, parentId: number) {
    const { name, description, form } = createMedicineCusDto;
  
    if (!name?.trim() || !description?.trim() || !form?.trim()) {
      throw new BadRequestException("Name, description, and form cannot be null or empty.");
    }
  
    const existingMedicineDef = await this.databaseService.medicineDef.findFirst({
      where: { 
        name,
        isDeleted: false
       },
    });
    if (existingMedicineDef) {
      throw new ConflictException(`A medicine with the name "${name}" already exists in default Medicine.`);
    }
  
    const existingMedicineCus = await this.databaseService.medicineCus.findFirst({
      where: {
        name,
        parentId,
        isDeleted: false
      },
    });
    if (existingMedicineCus) {
      throw new ConflictException(`A medicine with the name "${name}" already exists for this user.`);
    }
  
    createMedicineCusDto.isDeleted= false;

    return await this.databaseService.medicineCus.create({
      data: {
        ...createMedicineCusDto,
        medicine: createMedicineCusDto.medicine ?? { create: {} },
        parent: {
          connect: {
            parentId,
          },
        },
      },
    });
  }

  async findAll(parentId: number) {
    return await this.databaseService.medicineCus.findMany({
      where:{
        parentId,
        isDeleted: false
      }
    })
  }

  async findOne(id: number,parentId:number) {
    const existingMed = await this.databaseService.medicineCus.findUnique({
        where:{
          medID:id,
          parentId,
          isDeleted: false
        }
    })
    if(existingMed ==null){
      throw new NotFoundException("Medicine not found");
    }
    return existingMed;
  }

  async update(id: number,parentId:number, updateMedicineCusDto: Prisma.MedicineCusUpdateInput) {
    const existingMed = await this.databaseService.medicineCus.findUnique({
      where:{
        medID:id,
        parentId,
        isDeleted: false
      }
  })
  
  if(existingMed ==null){
    throw new NotFoundException("Medicine not found");
  }
    return this.databaseService.medicineCus.update({
      where:{medID:id},
      data: updateMedicineCusDto
    })
  }

  async remove(id: number,parentId:number) {
    const existingMed = await this.databaseService.medicineCus.findUnique({
      where:{
        medID:id,
        parentId,
        isDeleted: false
      }
  })
  if(existingMed ==null){
    throw new NotFoundException("Medicine not found");
  }
    return this.databaseService.medicineCus.update({
      where:{medID:id},
      data:{
        isDeleted: true
      }
    })
  }
}
