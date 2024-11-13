import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PostSymptomService } from './post-symptom.service';
import { CreatePostSymptomDto } from './dto/create-post-symptom.dto';
import { UpdatePostSymptomDto } from './dto/update-post-symptom.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Parent } from '@prisma/client';

@Controller('post-symptom')
export class PostSymptomController {
  constructor(private readonly postSymptomService: PostSymptomService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostSymptomDto: CreatePostSymptomDto, @CurrentUser() parent: Parent) {
    return this.postSymptomService.create(createPostSymptomDto, parent.parentId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() parent: Parent, @Query('id') id: number
  ) {
    return this.postSymptomService.findAll(parent.parentId, id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() parent: Parent) {
    return this.postSymptomService.findOne(+id, parent.parentId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePostSymptomDto: UpdatePostSymptomDto, @CurrentUser() parent: Parent) {
    return this.postSymptomService.update(+id, updatePostSymptomDto, parent.parentId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() parent: Parent) {
    return this.postSymptomService.remove(+id, parent.parentId);
  }
}
