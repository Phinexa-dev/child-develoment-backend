import { BadRequestException, ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'bcryptjs'
import { DatabaseService } from 'src/database/database.service';
import { CreateParentRequest } from './dto/create-parent.request';


@Injectable()
export class ParentService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createParentDto: CreateParentRequest) {

    const existingEmail = await this.databaseService.parent.findFirst({
      where: { email: createParentDto.email },
    });
    if (existingEmail) {
      throw new BadRequestException('Email is already in use');
    }

    const existingNumber = await this.databaseService.parent.findFirst({
      where: { phoneNumber: createParentDto.phoneNumber },
    });
    if (existingNumber) {
      throw new BadRequestException('Phone number is already in use');
    }
    const createParentData: Prisma.ParentCreateInput = {
      firstName: createParentDto.firstName,
      lastName: createParentDto.lastName,
      email: createParentDto.email,
      password: (await hash(createParentDto.password, 10)),
      phoneNumber: createParentDto.phoneNumber,
      image: createParentDto.image || null,
      bloodGroup: createParentDto.bloodGroup || null,
      address: createParentDto.address || null,
    };

    const user = await this.databaseService.parent.create({
      data: createParentData,
    });

    return {
      userId: user.parentId,
      email: user.email,
    };
  }

  async findAll() {
     return  await this.databaseService.parent.findMany({})
  }

  async findOne(parentId: number) {
    return this.databaseService.parent.findUnique({
      where: {
        parentId,
      }
    })
  }

  async update(parentId: number, updateParentDto: Prisma.ParentUpdateInput) {
    return this.databaseService.parent.update({
      where: {
        parentId,
      },
      data: updateParentDto,
    })
  }

  async remove(parentId: number) {
    return this.databaseService.parent.delete({
      where: { parentId }
    })
  }

  async findParent(email: string) {
    const parent = await this.databaseService.parent.findUnique({
      where: {
        email,
      }
    })
    if (!parent) {
      throw new NotFoundException("User not found")
    }
    return parent;
  }
}
