import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateSolidDto } from './dto/create-solid.dto';
import { UpdateSolidDto } from './dto/update-solid.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SolidService {

  constructor (private readonly databaseService:DatabaseService){}

  private async verifyParentChildRelation(parentId: number, childId: number) {
    const parentChildRelation = await this.databaseService.parentChild.findFirst({
      where: {
        parentId: parentId,
        childId: childId,
        status: 'Active',
      },
    });

    if (!parentChildRelation) {
      throw new UnauthorizedException('This child does not belong to the authenticated parent.');
    }
  }

   async create(createSolidDto: Prisma.SolidsCreateInput,parentId:number) {

    
    return this.databaseService.solids.create({
      data: createSolidDto,
    });
  }

  async findAll() {
    return this.databaseService.solids.findMany({
      include: {
        child: true,        
        categories: true,   
      },
    });
  }

  // Find a specific solid by ID
  async findOne(id: number) {
    const solid = await this.databaseService.solids.findUnique({
      where: { solidId: id },
      include: {
        child: true,
        categories: true,
      },
    });

    if (!solid) {
      throw new NotFoundException(`Solid with id ${id} not found.`);
    }

    return solid;
  }

  // Update a solid record
  async update(id: number, updateSolidDto: Prisma.SolidsUpdateInput) {
    const solidExists = await this.databaseService.solids.findUnique({
      where: { solidId: id },
    });

    if (!solidExists) {
      throw new NotFoundException(`Solid with id ${id} not found.`);
    }

    return this.databaseService.solids.update({
      where: { solidId: id },
      data: updateSolidDto,
    });
  }

  // Remove a solid record
  async remove(id: number) {
    const solidExists = await this.databaseService.solids.findUnique({
      where: { solidId: id },
    });

    if (!solidExists) {
      throw new NotFoundException(`Solid with id ${id} not found.`);
    }

    return this.databaseService.solids.delete({
      where: { solidId: id },
    });
  }
}
