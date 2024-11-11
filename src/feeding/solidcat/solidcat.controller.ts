import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { SolidcatService } from './solidcat.service';
import { Parent, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('solidcat')
export class SolidcatController {
  constructor(private readonly solidcatService: SolidcatService) {}

  @Post('child/:childId')
  @UseGuards(JwtAuthGuard)
  create(@Body() createSolidcatDto: Prisma.SolidCatCreateInput,
  @CurrentUser() parent: Parent,
  @Param('childId') childId: string) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }
  
    return this.solidcatService.create(createSolidcatDto,parent.parentId,childIdNumber);
  }

  @Get('child/:childId')
  @UseGuards(JwtAuthGuard)
  findAll( @CurrentUser() parent: Parent,
  @Param('childId') childId: string) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.solidcatService.findAll(parent.parentId,childIdNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string,
  @CurrentUser() parent: Parent) {
    return this.solidcatService.findOne(parent.parentId,+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string,
   @CurrentUser() parent: Parent,
   @Body() updateSolidcatDto: Prisma.SolidCatUpdateInput) {
    return this.solidcatService.update(parent.parentId,+id, updateSolidcatDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string,
  @CurrentUser() parent: Parent,) {
    return this.solidcatService.remove(parent.parentId ,+id);
  }
}
