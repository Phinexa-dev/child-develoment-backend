import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostSymptomDto } from './dto/create-post-symptom.dto';
import { UpdatePostSymptomDto } from './dto/update-post-symptom.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PostSymptomService {

  constructor(private readonly databaseService: DatabaseService) { }

  private async verifyParentChildRelation(parentId: number, childId: number) {
    const relation = await this.databaseService.parentChild.findFirst({
      where: {
        parentId: parentId,
        childId: childId,
        status: 'Active',
      },
    });

    if (!relation) {
      throw new UnauthorizedException('This child does not belong to the authenticated parent.');
    }
  }

  async create(createPostSymptomDto: CreatePostSymptomDto, parentId: number) {
    const { vaccinationId, symptomId } = createPostSymptomDto;

    const vaccination = await this.databaseService.vaccination.findUnique({
      where: { id: vaccinationId },
      select: { childId: true },
    });

    if (!vaccination) {
      throw new NotFoundException(`Vaccination with ID ${vaccinationId} not found.`);
    }

    await this.verifyParentChildRelation(parentId, vaccination.childId);

    const symptom = await this.databaseService.symptom.findUnique({
      where: { id: symptomId },
    });

    if (!symptom) {
      throw new NotFoundException(`Symptom with ID ${symptomId} not found.`);
    }

    return this.databaseService.postSymptom.create({
      data: {
        vaccination: { connect: { id: vaccinationId } },
        symptom: { connect: { id: symptomId } },
      },
    });
  }

  async findAll(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);

    return this.databaseService.postSymptom.findMany({
      where: {
        vaccination: { childId: childId },
        isDeleted: false,
      },
      include: {
        vaccination: true,
        symptom: true,
      },
    });
  }

  async findOne(id: number, parentId: number) {
    const postSymptom = await this.databaseService.postSymptom.findUnique({
      where: { id },
      include: { vaccination: true },
    });

    if (!postSymptom || postSymptom.isDeleted) {
      throw new NotFoundException(`PostSymptom with ID ${id} not found.`);
    }

    // Verify parent-child relationship
    await this.verifyParentChildRelation(parentId, postSymptom.vaccination.childId);

    return postSymptom;
  }

  async update(id: number, updatePostSymptomDto: UpdatePostSymptomDto, parentId: number) {
    const postSymptom = await this.databaseService.postSymptom.findUnique({
      where: { id },
      include: { vaccination: true },
    });

    if (!postSymptom || postSymptom.isDeleted) {
      throw new NotFoundException(`PostSymptom with ID ${id} not found.`);
    }

    // Verify parent-child relationship
    await this.verifyParentChildRelation(parentId, postSymptom.vaccination.childId);

    // Update the postSymptom entry
    return this.databaseService.postSymptom.update({
      where: { id },
      data: updatePostSymptomDto,
    });
  }

  async remove(id: number, parentId: number) {
    const postSymptom = await this.databaseService.postSymptom.findUnique({
      where: { id },
      include: { vaccination: true },
    });

    if (!postSymptom || postSymptom.isDeleted) {
      throw new NotFoundException(`PostSymptom with ID ${id} not found.`);
    }

    // Verify parent-child relationship
    await this.verifyParentChildRelation(parentId, postSymptom.vaccination.childId);

    // Soft delete the postSymptom entry by setting isDeleted to true
    return this.databaseService.postSymptom.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}