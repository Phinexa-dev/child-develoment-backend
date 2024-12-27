import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, UseInterceptors, ParseIntPipe, UploadedFiles } from '@nestjs/common';
import { VaccinationService } from './vaccination.service';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Parent } from '@prisma/client';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Express } from 'express';


@Controller('vaccination')
export class VaccinationController {
  constructor(private readonly vaccinationService: VaccinationService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createVaccinationDto: CreateVaccinationDto,
    @CurrentUser() parent: Parent,
  ) {
    return this.vaccinationService.create(createVaccinationDto, parent.parentId);
  }

  @Get(':childId')
  @UseGuards(JwtAuthGuard)
  findAll(
    @Param('childId') childId: string,
    @CurrentUser() parent: Parent
  ) {
    const childIdNumber = parseInt(childId, 10);
    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.vaccinationService.findAll(parent.parentId, childIdNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.vaccinationService.findOne(+id);
  }

  @Post(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'images', maxCount: 10 }],
      {
        storage: diskStorage({
          destination: './uploads', //
          filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueName);
          },
        }),
        fileFilter: (req, file, cb) => {
          const allowedMimeTypes = ['image/jpeg', 'image/png'];
          if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new BadRequestException('Invalid file type'), false);
          }
        },
      },
    ),
  )
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVaccinationDto: UpdateVaccinationDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @CurrentUser() parent: Parent,
  ) {
    
    const imagePaths = files?.images?.map(file => file.filename) || [];

    return this.vaccinationService.update(id, { ...updateVaccinationDto, images: imagePaths }, parent.parentId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @CurrentUser() parent: Parent
  ) {
    return this.vaccinationService.remove(+id, parent.parentId);
  }
}


