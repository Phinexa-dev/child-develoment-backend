import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { SolidService } from './solid.service';
import { CreateSolidDto } from './dto/create-solid.dto';
import { UpdateSolidDto } from './dto/update-solid.dto';
import { Parent, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('solid')
export class SolidController {
  constructor(private readonly solidService: SolidService) {}

  @Post('child/:childId')
  @UseGuards(JwtAuthGuard)
  create(@Body() createSolidDto: Prisma.SolidsCreateInput,
   @CurrentUser() parent :Parent, 
   @Param('childId') childId: string) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }
    if (!createSolidDto.child) {
      createSolidDto.child = {
        connect: { childId: childIdNumber },
      };
    } else {
      createSolidDto.child.connect = { childId: childIdNumber };
    }
    return this.solidService.create(createSolidDto,parent.parentId);
  }

  @Get()
  findAll() {
    return this.solidService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solidService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSolidDto: UpdateSolidDto) {
    return this.solidService.update(+id, updateSolidDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solidService.remove(+id);
  }
}
