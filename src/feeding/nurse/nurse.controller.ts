import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { NurseService } from './nurse.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Parent, Prisma } from '@prisma/client';

@Controller('nurse')
export class NurseController {
  constructor(private readonly nurseService: NurseService) { }

  @Post('child/:childId')
  @UseGuards(JwtAuthGuard)
  create(@Body() createNurseDto: Prisma.NursingCreateInput,
    @CurrentUser() parent: Parent,
    @Param('childId') childId: string,) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }

    if (!createNurseDto.child) {
      createNurseDto.child = {
        connect: { childId: childIdNumber },
      };
    } else {
      createNurseDto.child.connect = { childId: childIdNumber };
    }
    return this.nurseService.create(createNurseDto, parent.parentId);
  }

  @Get("child/:childId")
  @UseGuards(JwtAuthGuard)
  findAll(
    @Param('childId') childId: string,
    @CurrentUser() parent: Parent
  ) {
    const childID = parseInt(childId, 10)
    if (isNaN(childID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.nurseService.findAll(parent.parentId, childID)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string,
    @CurrentUser() parent: Parent) {
    const recID = parseInt(id, 10)
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.nurseService.findOne(recID, parent.parentId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string,
    @Body() updateNurseDto: Prisma.NursingUpdateInput,
    @CurrentUser() parent: Parent) {
    const recID = parseInt(id, 10)
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.nurseService.update(recID, updateNurseDto, parent.parentId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string,
  @CurrentUser() parent: Parent) {
    const recID = parseInt(id, 10)
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.nurseService.remove(recID,parent.parentId);
  }
}