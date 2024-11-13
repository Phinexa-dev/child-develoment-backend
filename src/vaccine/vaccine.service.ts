import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class VaccineService {
  constructor(private readonly databaseService: DatabaseService) { }

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
  async create(createVaccineDto: CreateVaccineDto) {

    return await this.databaseService.vaccine.create({
      data: createVaccineDto,
    });
  }
  async findOne(id: number, parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);
    const child = await this.databaseService.child.findUnique({
      where: {
        childId
      }, select: { region: true }
    })
    const vaccine = await this.databaseService.vaccine.findUnique({
      where: { id, region: child.region }
    })
    if (!vaccine) {
      throw new NotFoundException('Vaccine Not found');
    }
    return vaccine;
  }

  async findAll(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);
    const child = await this.databaseService.child.findUnique({
      where: {
        childId
      },
      select: { region: true }
    })
    return await this.databaseService.vaccine.findMany({
      where: {
        isDeleted: false,
        region: {
          equals: child.region,
          mode: 'insensitive',
        },
      }, select: {
        id: true, name: true, region: true, notes: true, ageInMonths: true, whereTo: true, period:true
      }
    })
  }

  async update(id: number, updateVaccineDto: UpdateVaccineDto) {
    const vaccine = await this.databaseService.vaccine.findUnique({ where: { id } });
    if (!vaccine) {
      throw new NotFoundException(`Vaccine with ID ${id} not found`);
    }
    return this.databaseService.vaccine.update({
      where: { id },
      data: updateVaccineDto,
    });
  }

  async remove(id: number) {
    const vaccine = await this.databaseService.vaccine.findUnique({ where: { id } });
    if (!vaccine) {
      throw new NotFoundException(`Vaccine with ID ${id} not found`);
    }
    return await this.databaseService.vaccine.update({
      where: { id },
      data: { isDeleted: true }
    })
  }
}
