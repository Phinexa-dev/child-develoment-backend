import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createFeedbackDto: CreateFeedbackDto) {
    return this.databaseService.feedback.create({
      data: createFeedbackDto
    });
  }


  async findAll() {
    return this.databaseService.feedback.findMany({
      select: { id: true, lovedFeatures: true, wishToHaveFeatures: true, struggleToUseFeatures: true }
    });
  }

  async findOne(id: number) {
    const feedback = await this.databaseService.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundException(`Symptom with ID ${id} not found.`);
    }

    return feedback;
  }

  async remove(id: number) {
    const feedback = await this.databaseService.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found.`);
    }

    return this.databaseService.feedback.delete({
      where: { id },
    });
  }
}
