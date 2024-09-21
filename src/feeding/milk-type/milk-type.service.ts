import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MilkTypeService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createMilkTypeDto: Prisma.MilkTypeCreateInput) {
    try {
      if (!createMilkTypeDto.milkType) {
        throw new BadRequestException('MilkType name is required');
      }
      const existingMilkType = await this.databaseService.milkType.findMany({
        where: {
          milkType: {
            equals: createMilkTypeDto.milkType,
            mode: 'insensitive',
          },
        },
      });
      if (existingMilkType.length != 0) {
        throw new BadRequestException(`MilkType '${createMilkTypeDto.milkType}' already exists`);
      }
      const newMilkType = await this.databaseService.milkType.create({
        data: createMilkTypeDto,
      });

      return newMilkType;
    } catch (error) {
      throw (error)
    }
  }

  async findAll() {
    try {
      const milkTypes = await this.databaseService.milkType.findMany();
      if (!milkTypes.length) {
        throw new NotFoundException('No milk types found');
      }
      return milkTypes;
    } catch (error) {
      throw(error);
    }
  }

  async findOne(id: number) {
    try {
      const milkType = await this.databaseService.milkType.findUnique({
        where: { typeID: id },
      });

      if (!milkType) {
        throw new NotFoundException(`MilkType with ID #${id} not found`);
      }

      return milkType;
    } catch (error) {
      throw(error);
    }
  }

  async update(id: number, updateMilkTypeDto: Prisma.MilkTypeUpdateInput) {
    try {
      const milkType = await this.findOne(id);

      const updatedMilkType = await this.databaseService.milkType.update({
        where: { typeID: id },
        data: updateMilkTypeDto,
      });

      return updatedMilkType;
    } catch (error) {
      throw(error);
    }
  }

  async remove(id: number) {
    try {
      const milkType = await this.findOne(id);
      if (!milkType) {
        throw new NotFoundException()
      }
      const deletedMilkType = await this.databaseService.milkType.delete({
        where: { typeID: id },
      });

      return deletedMilkType;
    } catch (error) {
      throw(error);
    }
  }
}