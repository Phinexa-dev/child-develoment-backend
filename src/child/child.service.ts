import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateChildDto } from './dto/create-child-dto';
import { UpdateChildDto } from './dto/update-child-dto';


@Injectable()
export class ChildService {

  constructor(private readonly databaseService: DatabaseService) { }

  async create(createChildDto: CreateChildDto, parentId: number) {

    const child = await this.databaseService.child.create({
      data: {
        firstName: createChildDto.firstName,
        middleName: createChildDto.middleName,
        lastName: createChildDto.lastName,
        birthday: createChildDto.birthday,
        region: createChildDto.region,
        image: createChildDto.image,
        gender: createChildDto.gender,
        bloodGroup: createChildDto.bloodGroup,
      },
    });

    await this.databaseService.parentChild.create({
      data: {
        parentId: parentId,
        childId: (await child).childId,
        relation: 'Parent',
        status: 'Active',
        requestedDate: new Date(),
      },
    });

    return child;
  }

  async findAll(parentId: number) {
    const activeChildren = await this.databaseService.parentChild.findMany({
      where: {
        parentId: parentId,
        status: 'Active',
      },
      include: {
        child: true,
      },
    });

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
      throw new NotFoundException('Child does not belong to this parent or is not active.');
    }

    return await this.databaseService.child.findUnique({
      where: {
        childId: id,
      }
    })
  }

  async update(id: number, updateChildDto: UpdateChildDto, parentId: number) {

    const parentChildRelation = await this.databaseService.parentChild.findFirst({
      where: {
        parentId: parentId,
        childId: id,
        status: 'Active',
      },
    });

    if (!parentChildRelation || parentChildRelation.status !== 'Active') {
      throw new UnauthorizedException('You are not authorized to update this child information');
    }

    const updatedChild = await this.databaseService.child.update({
      where: { childId: id },
      data: {
        ...updateChildDto,
      },
    });

    return updatedChild;
  }


  async remove(id: number, parentId: number): Promise<void> {

    const parentChildRelation = await this.databaseService.parentChild.findFirst({
      where: {
        parentId: parentId,
        childId: id,
        status: 'Active'
      },
    });

    if (!parentChildRelation) {
      throw new NotFoundException('Child does not belong to this parent or is not active.');
    }

    await this.databaseService.parentChild.update({
      where: {
        id: parentChildRelation.id
      }, data: {
        status: 'Deleted'
      }
    })
    return
  }
}
