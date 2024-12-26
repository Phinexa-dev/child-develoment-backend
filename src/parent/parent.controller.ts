import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ParentService } from './parent.service';
import { Parent, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) { }

  // @Post()
  // async create(@Body() createParentDto: Prisma.ParentCreateInput) {
  //   return this.parentService.create(createParentDto);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() parent: Parent) {
    return this.parentService.findMyAccount(parent.parentId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.parentService.findOne(+id);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  async update(@CurrentUser() parent: Parent, @Param('id') id: string, @Body() updateParentDto: Prisma.ParentUpdateInput,) {
    return this.parentService.UpdateMyAccount(+id, updateParentDto,parent.parentId);
  }

  @Get('delete/:id')
  async remove(@Param('id') id: string) {
    return this.parentService.remove(+id);
  }
}
