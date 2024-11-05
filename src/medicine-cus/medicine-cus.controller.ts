import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MedicineCusService } from './medicine-cus.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Parent, Prisma } from '@prisma/client';

@Controller('medicine-cus')
export class MedicineCusController {
  constructor(private readonly medicineCusService: MedicineCusService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createMedicineCusDto: Prisma.MedicineCusCreateInput,
    @CurrentUser() parent: Parent) {
    return this.medicineCusService.create(createMedicineCusDto, parent.parentId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() parent: Parent) {
    return this.medicineCusService.findAll(parent.parentId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() parent: Parent) {
    return this.medicineCusService.findOne(+id, parent.parentId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string,
    @Body() updateMedicineCusDto: Prisma.MedicineCusUpdateInput,
    @CurrentUser() parent: Parent
  ) {
    return this.medicineCusService.update(+id, parent.parentId, updateMedicineCusDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string,
    @CurrentUser() parent: Parent) {
    return this.medicineCusService.remove(+id, parent.parentId);
  }
}
