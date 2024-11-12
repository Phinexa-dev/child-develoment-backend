import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostSymptomService } from './post-symptom.service';
import { CreatePostSymptomDto } from './dto/create-post-symptom.dto';
import { UpdatePostSymptomDto } from './dto/update-post-symptom.dto';

@Controller('post-symptom')
export class PostSymptomController {
  constructor(private readonly postSymptomService: PostSymptomService) {}

  @Post()
  create(@Body() createPostSymptomDto: CreatePostSymptomDto) {
    return this.postSymptomService.create(createPostSymptomDto);
  }

  @Get()
  findAll() {
    return this.postSymptomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postSymptomService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostSymptomDto: UpdatePostSymptomDto) {
    return this.postSymptomService.update(+id, updatePostSymptomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postSymptomService.remove(+id);
  }
}
