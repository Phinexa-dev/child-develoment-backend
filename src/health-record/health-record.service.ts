import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';
import { unlinkSync } from 'fs';

@Injectable()
export class HealthRecordService {

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) { }

  private async verifyParentChildRelation(parentId: number, childId: number) {
    const parentChildRelation = await this.databaseService.parentChild.findFirst({
      where: {
        parentId,
        childId,
        status: 'Active',
      },
    });

    if (!parentChildRelation) {
      throw new UnauthorizedException('This child does not belong to the authenticated parent.');
    }
  }


  async create(createHealthRecordDto: CreateHealthRecordDto, parentId: number) {
    const childId = parseInt(createHealthRecordDto.childId as any, 10);

    if (isNaN(childId)) {
      throw new BadRequestException('Invalid childId format');
    }

    await this.verifyParentChildRelation(parentId, childId);

    return this.databaseService.healthRecords.create({
      data: {
        child: {
          connect: {
            childId,
          },
        },
        file: createHealthRecordDto.file,
        title: createHealthRecordDto.title,
        notes: createHealthRecordDto.notes,
        date: createHealthRecordDto.date
      },
    });
  }

  async findAll(parentId: number, childId: number) {
    await this.verifyParentChildRelation(parentId, childId);

    const records = await this.databaseService.healthRecords.findMany({
      where: {
        childId,
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        file: true,
        childId: true,
        notes: true,
        date: true
      },
      orderBy: {
        id: 'desc',
      },
    });
    const baseUrl = this.configService.getOrThrow('ENV');
    return records.map(record => ({
      ...record,
      file: `${baseUrl}/health-records/${record.file}`,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} healthRecord`;
  }

  async update(
    id: number,
    updateHealthRecordDto: UpdateHealthRecordDto,
    file: Express.Multer.File | null,
    parentId: number,
  ) {
    const existingRecord = await this.databaseService.healthRecords.findUnique({
      where: { id },
      select: { childId: true, file: true },
    });

    if (!existingRecord) {
      throw new NotFoundException(`Health record with ID ${id} not found`);
    }

    await this.verifyParentChildRelation(parentId, existingRecord.childId);

    if (file) {
      const filePath = `./uploads/health-records/${existingRecord.file}`;
      try {
        unlinkSync(filePath); 
      } catch (err) {
        console.warn(`File not found or already deleted: ${filePath}`);
      }

      updateHealthRecordDto.file = file.filename;
    }

    return this.databaseService.healthRecords.update({
      where: { id },
      data: {
        ...updateHealthRecordDto,
      },
    });
  }

  async remove(id: number, parentId: number) {
    const record = await this.databaseService.healthRecords.findUnique({
      where: { id },
    });

    if (!record || record.isDeleted) {
      throw new NotFoundException(`Health record with ID ${id} not found.`);
    }

    await this.verifyParentChildRelation(parentId, record.childId);

    return this.databaseService.healthRecords.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
