import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SchoolsService {
  constructor(private readonly databaseService:DatabaseService){}

  async create(createSchoolDto: Prisma.SchoolCreateInput) {
    return this.databaseService.school.create({data:createSchoolDto})
  }

  async findAll() {
    this.databaseService.school.findMany({});
  }

  async findOne(sid: number) {
    return this.databaseService.school.findUnique({
      where:{
        sid,
      }
    })
  }

 async update(sid: number, updateSchoolDto: Prisma.SchoolUpdateInput) {
    return this.databaseService.school.update({
      where:{
        sid,
      },
      data:updateSchoolDto
    })
  }

  async remove(sid: number) {
    return this.databaseService.school.delete({
      where:{sid}
    })
  }
}
