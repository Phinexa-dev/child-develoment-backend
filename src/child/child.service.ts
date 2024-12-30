import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateChildDto } from './dto/create-child-dto';
import { UpdateChildDto } from './dto/update-child-dto';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChildService {

  constructor(private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService) { }

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

    const vaccines = await this.databaseService.vaccine.findMany({
      where: {
        region: {
          equals: child.region,
          mode: 'insensitive'
        },
        isDeleted: false,
      },
    });

    const vaccinationData = vaccines.map(vaccine => {
      const vaccinationDate = new Date(child.birthday);
      vaccinationDate.setMonth(vaccinationDate.getMonth() + vaccine.ageInMonths);
      return {
        childId: child.childId,
        vaccineId: vaccine.id,
        date: vaccinationDate,
      };
    });

    await this.databaseService.vaccination.createMany({
      data: vaccinationData
    });

    return child;
  }

  async findAll(parentId: number) {
    const baseUrl = this.configService.getOrThrow('ENV');

    const activeChildren = await this.databaseService.parentChild.findMany({
      where: {
        parentId: parentId,
        status: 'Active',
      },
      include: {
        child: true,
      },
    });

    const children = activeChildren.map(relation => {
      const child = relation.child;

      return {
        ...child,
        image: child.image ? `${baseUrl}/child-images/${child.image}` : null,
      };
    });

    return children;
  }

  async findOne(id: number, parentId: number) {

    const parentChildRelation = await this.databaseService.parentChild.findFirst({
      where: {
        parentId: parentId,
        childId: id,
        status: 'Active',
      },
    });

    if (!parentChildRelation) {
      throw new NotFoundException('Child does not belong to this parent or is not active.');
    }

    const child = await this.databaseService.child.findUnique({
      where: {
        childId: id,
      },
    });

    if (!child) {
      throw new NotFoundException('Child record not found.');
    }

    const baseUrl = this.configService.getOrThrow('ENV');
    return {
      ...child,
      image: child.image ? `${baseUrl}/uploads/child-images/${child.image}` : null,
    };
  }

  private async deleteFile(filePath: string) {
    try {
      const fullPath = path.join('./uploads/child-images', filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (err) {
      console.error(`Error deleting file: ${err.message}`);
    }
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

    const existingChild = await this.databaseService.child.findUnique({
      where: { childId: id },
      select: { image: true },
    });

    if (!existingChild) {
      throw new BadRequestException('Child record not found.');
    }

    // Delete the existing image if a new one is uploaded
    if (updateChildDto.image && existingChild.image) {
      await this.deleteFile(existingChild.image);
    }

    return this.databaseService.child.update({
      where: { childId: id },
      data: updateChildDto,
    });
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
