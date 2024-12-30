import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, BadRequestException, ParseIntPipe, UploadedFile } from '@nestjs/common';
import { HealthRecordService } from './health-record.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Parent } from '@prisma/client';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('health-record')
export class HealthRecordController {
  constructor(private readonly healthRecordService: HealthRecordService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/health-records',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Invalid file type'), false);
        }
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createHealthRecordDto: CreateHealthRecordDto,
    @CurrentUser() parent: Parent,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.healthRecordService.create(
      { ...createHealthRecordDto, file: file.filename },
      parent.parentId,
    );
  }

  @Get(':childId')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Param('childId', ParseIntPipe) childId: number,
    @CurrentUser() parent: Parent,
  ) {
    return this.healthRecordService.findAll(parent.parentId, childId);
  }

  @Get('/delete/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() parent: Parent) {
    return this.healthRecordService.remove(id, parent.parentId);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/health-records',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Invalid file type'), false);
        }
      },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File | null,
    @Body() updateHealthRecordDto: UpdateHealthRecordDto,
    @CurrentUser() parent: Parent,
  ) {
    return this.healthRecordService.update(id, updateHealthRecordDto, file, parent.parentId);
  }


  // @Post()
  // create(@Body() createHealthRecordDto: CreateHealthRecordDto) {
  //   return this.healthRecordService.create(createHealthRecordDto);
  // }

  // @Get()
  // findAll() {
  //   return this.healthRecordService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.healthRecordService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateHealthRecordDto: UpdateHealthRecordDto) {
  //   return this.healthRecordService.update(+id, updateHealthRecordDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.healthRecordService.remove(+id);
  // }
}
