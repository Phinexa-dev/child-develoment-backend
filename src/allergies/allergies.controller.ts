import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { AllergiesService } from './allergies.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Parent, Prisma } from '@prisma/client';

@Controller('allergies')
export class AllergiesController {
  constructor(private readonly allergiesService: AllergiesService) { }

  @Post('child/:childId')
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createAllergyDto: Prisma.AllergiesCreateInput,
    @CurrentUser() parent: Parent,
    @Param('childId') childId: string,
  ) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }

    if (!createAllergyDto.child) {
      createAllergyDto.child = {
        connect: { childId: childIdNumber },
      };
    } else {
      createAllergyDto.child.connect = { childId: childIdNumber };
    }
    return this.allergiesService.create(createAllergyDto,parent.parentId);
  }

  @Get('child/:childId')
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser() parent:Parent,
    @Param('childId') childId: string,
  ) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.allergiesService.findAll(parent.parentId,childIdNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id') id: string,
    @CurrentUser() parent: Parent
) {
    return this.allergiesService.findOne(+id,parent.parentId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateAllergyDto: Prisma.AllergiesUpdateInput,
    @CurrentUser() parent:Parent) {
    return this.allergiesService.update(+id, updateAllergyDto, parent.parentId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @CurrentUser() parent: Parent) {
    return this.allergiesService.remove(+id,parent.parentId);
  }
}
