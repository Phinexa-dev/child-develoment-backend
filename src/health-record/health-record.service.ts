import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';

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

  update(id: number, updateHealthRecordDto: UpdateHealthRecordDto) {
    return `This action updates a #${id} healthRecord`;
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
