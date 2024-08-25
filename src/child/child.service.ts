import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Child, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class ChildService {

  constructor(private readonly databaseService: DatabaseService) { }

  async create(createChildDto: Prisma.ChildCreateInput, parentId: number) {


    const child = await this.databaseService.child.create({
      data: {
        ...createChildDto,
      }
    })
    await this.databaseService.parentChild.create({
      data: {
        parentId: parentId,
        childId: (await child).childId,
        relation: 'Parent',  // You can modify this value as needed
        status: 'Active',    // You can modify this value as needed
        requestedDate: new Date(),  // Current date or you can set a specific date
      },
    });

    return child;
  }


  async findAll(parentId: number) {
    const activeChildren = await this.databaseService.parentChild.findMany({
      where: {
        parentId: parentId, // Filter by the parent ID
        status: 'Active',   // Only get active relations
      },
      include: {
        child: true, // Include the child details in the response
      },
    });
    
    // Extracting the child details
    const children = activeChildren.map(relation => relation.child);
    return children;
  }

  async findOne(id: number, parentId: number) {


    const parentChildRelation = await this.databaseService.parentChild.findFirst({
      where: {
        parentId: parentId,
        childId: id,
        status: 'Active'
      },
    });


    if (!parentChildRelation) {
      // If no relationship is found, throw an exception or return null
      throw new NotFoundException('Child does not belong to this parent or is not active.');
    }


    return this.databaseService.child.findUnique({
      where: {
        childId: id,

      }
    })
  }

  async update(id: number, updateChildDto: Prisma.ChildUpdateInput, parentId: number) {
    const parentChildRelation = await this.databaseService.parentChild.findFirst({
      where: {
        parentId: parentId,
        childId: id,
        status: 'Active'
      },
    });

    // Check if the relation exists and is active
    if (!parentChildRelation || parentChildRelation.status !== 'Active') {
      throw new UnauthorizedException('You are not authorized to update this child');
    }

    // Update the child
    const updatedChild = await this.databaseService.child.update({
      where: { childId: id },
      data: updateChildDto,
    });

    return updatedChild;
  }

  remove(id: number) {
    return `This action removes a #${id} child`;
  }
}
