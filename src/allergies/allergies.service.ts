import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';


@Injectable()
export class AllergiesService {
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

  async create(createAllergyDto: Prisma.AllergiesCreateInput, parentId: number) {

    await this.verifyParentChildRelation(parentId, createAllergyDto.child.connect.childId);
    if (!createAllergyDto.type) {
      throw new BadRequestException("Fied Type is required");
    }

    createAllergyDto.isDeleted = false;

    return await this.databaseService.allergies.create({
      data: createAllergyDto,
    });
  }

  async findAll(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);

    return this.databaseService.allergies.findMany({
      where: {
        childId: childId,
        isDeleted: false,
      },
    });
  }

  async findOne(id: number, parentId: number) {

    const allergy = await this.databaseService.allergies.findUnique({
      where:
      {
        allergyId: id,
        isDeleted: false
      },
    });

    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    await this.verifyParentChildRelation(parentId, allergy.childId);

    return allergy;
  }

  async update(id: number, updateAllergyDto: Prisma.AllergiesUpdateInput, parentId: number) {

    const allergy = await this.databaseService.allergies.findUnique({
      where: {
        allergyId: id,
        isDeleted: false
      },
    });

    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    await this.verifyParentChildRelation(parentId, allergy.childId);

    if ('isDeleted' in updateAllergyDto) {
      throw new BadRequestException("Cannot update 'isDeleted' field");
    }

    return this.databaseService.allergies.update({
      where: { allergyId: id },
      data: updateAllergyDto,
    });
  }

  async remove(id: number, parentId: number) {
    const allergy = await this.databaseService.allergies.findUnique({
      where: {
        allergyId: id,
        isDeleted: false
      },
    });

    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    await this.verifyParentChildRelation(parentId, allergy.childId);

    return this.databaseService.allergies.update({
      where: { allergyId: id },
      data: { isDeleted: true },
    });
  }
}
