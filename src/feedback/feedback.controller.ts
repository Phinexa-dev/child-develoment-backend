import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  create(@Body() createSymptomDto: CreateFeedbackDto) {
    return this.feedbackService.create(createSymptomDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(+id);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(+id);
  }
}
