import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SolidcatService {
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

  async create(createSolidcatDto: Prisma.SolidCatCreateInput, parentId: number, childId: number) {
    
    const solidId = createSolidcatDto.solid?.connect?.solidId;

    if (!solidId) {
      throw new BadRequestException('Solid ID is required.');
    }
    const solid = await this.databaseService.solids.findUnique({
      where: { solidId: createSolidcatDto.solid.connect.solidId,
                childId: childId
       },
    });

    if (!solid) {
      throw new NotFoundException(`Solid with id ${createSolidcatDto.solid.connect.solidId} not found.`);
    }

    await this.verifyParentChildRelation(parentId, childId);

    if (!createSolidcatDto.categoryItem || !createSolidcatDto.categoryItem.connect || !createSolidcatDto.categoryItem.connect.itemId) {
      throw new BadRequestException('categoryItem or itemId is missing in the request body');
    }
  
    const categoryItemId = createSolidcatDto.categoryItem.connect.itemId;
  
    const categoryItem = await this.databaseService.categoryItems.findUnique({
      where: { itemId: categoryItemId },
    });
  
    if (!categoryItem) {
      throw new BadRequestException(`Category item with ID ${categoryItemId} not found`);
    }

    // if (!categoryItem.isDefault) {
    //   if (categoryItem.parentId !== parentId) {
    //     throw new UnauthorizedException(
    //       `Category item with ID ${categoryItemId} does not belong to the authenticated parent.`
    //     );
    //   }
    // }
    return this.databaseService.solidCat.create({
      data: createSolidcatDto,
    });
  }

  async findAll(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);

    return this.databaseService.solidCat.findMany({
      where: {
        solid: {
          childId: childId,
        },
      },
      include: {
        categoryItem: true,
        solid: true,
      },
    });
  }

  async findOne(parentId: number, id: number) {

    const solidCat = await this.databaseService.solidCat.findUnique({
      where: { id },
      include: {
        categoryItem: true,
        solid: true
        },
      },
    );

    if (!solidCat) {
      throw new NotFoundException(`SolidCat with id ${id} not found.`);
    }
    await this.verifyParentChildRelation(parentId, solidCat.solid.childId);
    return solidCat;
  }

  async update(parentId: number,  id: number, updateSolidcatDto: Prisma.SolidCatUpdateInput) {
    
    const existingSolidCat = await this.databaseService.solidCat.findUnique({
      where: { id },
      include: {
        categoryItem: true,
        solid: true
      },
    });

    if (!existingSolidCat) {
      throw new NotFoundException(`SolidCat with id ${id} not found.`);
    }
    await this.verifyParentChildRelation(parentId, existingSolidCat.solid.childId);

    return this.databaseService.solidCat.update({
      where: { id },
      data: updateSolidcatDto,
    });
  }

  async remove(parentId:number,id: number,) {
    const existingSolidCat = await this.databaseService.solidCat.findUnique({
      where: { id },
      include: {
        categoryItem: true,
        solid: true
      },
    });

    if (!existingSolidCat) {
      throw new NotFoundException(`SolidCat with id ${id} not found.`);
    }
    await this.verifyParentChildRelation(parentId, existingSolidCat.solid.childId);

    this.databaseService.solidCat.delete({
      where:{
        id
      }
    });
      
  }
}

