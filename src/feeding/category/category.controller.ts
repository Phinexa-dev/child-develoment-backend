import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, UseInterceptors, UsePipes, ValidationPipe, UploadedFile } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { CreateCategoryDto } from './category-dto/create-category-dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/food-categories',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'), false);
        }
      },
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    if (!file) {
      throw new BadRequestException('Category image is required');
    }

    const imagePath = `${file.filename}`; // Store only the relative path
    return this.categoryService.create({ ...createCategoryDto, imagePath });
  }
  // create(@Body() createCategoryDto: Prisma.CategoryCreateInput) {
  //   return this.categoryService.create(createCategoryDto);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    const recID = parseInt(id, 10);
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid Category id format.');
    }
    return this.categoryService.findOne(recID);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: Prisma.CategoryUpdateInput) {
    const recID = parseInt(id, 10);
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid Category id format.');
    }
    return this.categoryService.update(recID, updateCategoryDto);
  }

  @Get('delete/:id')
  remove(@Param('id') id: string) {
    const recID = parseInt(id, 10);
    if (isNaN(recID)) {
      throw new BadRequestException('Invalid Category id format.');
    }
    return this.categoryService.remove(recID);
  }
}