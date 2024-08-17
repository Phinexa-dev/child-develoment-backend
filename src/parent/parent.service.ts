import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class ParentService {
constructor(private readonly databaseService: DatabaseService){}

  async create(createParentDto: Prisma.ParentCreateInput) {
    return this.databaseService.parent.create({data:createParentDto})
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
}
