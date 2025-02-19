import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, BadRequestException, UseInterceptors } from '@nestjs/common';
import { ParentService } from './parent.service';
import { Parent, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UpdateParentDto } from './dto/update-parent-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) { }

  // @Post()
  // async create(@Body() createParentDto: Prisma.ParentCreateInput) {
  //   return this.parentService.create(createParentDto);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() parent: Parent) {
    return this.parentService.findMyAccount(parent.parentId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.parentService.findOne(+id);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/parent-images',
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
    @CurrentUser() parent: Parent,
    @Param('id') id: string,
    @Body() updateParentDto: UpdateParentDto,
    @UploadedFile() file: Express.Multer.File | null,
  ) {
    const parentId = parseInt(id, 10);
    if (isNaN(parentId)) {
      throw new BadRequestException('Invalid parentId format');
    }

    return this.parentService.UpdateMyAccount(parentId, updateParentDto, parent.parentId, file);
  }

  @Get('delete/:id')
  async remove(@Param('id') id: string) {
    return this.parentService.remove(+id);
  }
}
