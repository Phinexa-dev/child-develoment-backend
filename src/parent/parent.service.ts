import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {hash} from 'bcryptjs'
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class ParentService {
constructor(private readonly databaseService: DatabaseService){}

  async create(createParentDto: Prisma.ParentCreateInput) {
    return this.databaseService.parent.create({
      data:{...createParentDto,password: await hash(createParentDto.password,10)}
    })
  }

  async findAll() {
    return this.databaseService.parent.findMany({});

  }

  async findOne(parentId: number) {
    return this.databaseService.parent.findUnique({
      where:{
        parentId,
      }
    })
  }

  async update(parentId: number, updateParentDto: Prisma.ParentUpdateInput) {
    return this.databaseService.parent.update({
      where:{
        parentId,
      },
      data:updateParentDto,
    })
  }

  async remove(parentId: number) {
    return this.databaseService.parent.delete({
      where:{parentId}
    })
    }

    async findParent(email: string) {
      const parent = await this.databaseService.parent.findUnique({
        where:{
          email,
        }
      })
      if(!parent){
        throw new NotFoundException("User not found")
      }
      return parent;
    }
}
