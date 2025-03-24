import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, ParseIntPipe, BadRequestException, UseInterceptors } from '@nestjs/common';
import { ChildService } from './child.service';
import { Parent } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CreateChildDto } from './dto/create-child-dto';
import { UpdateChildDto } from './dto/update-child-dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('child')
export class ChildController {
  constructor(private readonly childService: ChildService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/child-images',
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
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createChildDto: CreateChildDto,
    @CurrentUser() parent: Parent,
  ) {
    const imagePath = file ? `uploads/child-images/${file.filename}` : null;

    return this.childService.create(
      { ...createChildDto, image: imagePath },
      parent.parentId,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() parent: Parent) {
    return this.childService.findAll(parent.parentId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number, @CurrentUser() parent: Parent) {
    return this.childService.findOne(+id, parent.parentId);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/child-images',
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
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChildDto: UpdateChildDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() parent: Parent,
  ) {
    const imagePath = file ? file.filename : null;

    return this.childService.update(id, { ...updateChildDto, image: imagePath }, parent.parentId);
  }

  @Get('delete/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number, @CurrentUser() parent: Parent) {
    return this.childService.remove(+id, parent.parentId);
  }
}
