import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryItemService } from './category-item.service';
import { Parent, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CreateCategoryItemDto } from './category-item-dto/create-category-item-dto';
import { UpdateCategoryItemDto } from './category-item-dto/update-category-item-dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('category-item')
export class CategoryItemController {
  constructor(private readonly categoryItemService: CategoryItemService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/food_items',
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
    @Body() createCategoryItemDto: CreateCategoryItemDto,
    @CurrentUser() parent: Parent,
  ) {
    const imagePath = file ? `food_items/${file.filename}` : null;

    return this.categoryItemService.create(
      { 
        ...createCategoryItemDto, 
        imagePath: imagePath,
      },
      parent?.parentId
    );
  }
  // create(@Body() createCategoryItemDto: CreateCategoryItemDto,
  //   @CurrentUser() parent: Parent,) {
  //   return this.categoryItemService.create(createCategoryItemDto, parent.parentId);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() parent: Parent) {
    return this.categoryItemService.findAll(parent.parentId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() parent: Parent) {
    return this.categoryItemService.findOne(+id, parent.parentId);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCategoryItemDto: UpdateCategoryItemDto, @CurrentUser() parent: Parent) {
    return this.categoryItemService.update(+id,parent.parentId, updateCategoryItemDto);
  }

  @Get('delete/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string,@CurrentUser() parent: Parent) {
    return this.categoryItemService.remove(+id,parent.parentId);
  }
}
