import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // @Post()
  // async create(@Body() createArticleDto: Prisma.ArticleCreateInput) {
  //   return this.articleService.create(createArticleDto);
  // }
@Post()
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/articles',
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
  @Body() createArticleDto: Prisma.ArticleCreateInput,
) {
  if (!file) {
    throw new BadRequestException('Article image is required');
  }

  // const imagePath = `articles/${file.filename}`;

  const formattedContent = createArticleDto.content
    .replace(/\r\n/g, '\n')
    .replace(/\n{2,}/g, '\n\n');

  return this.articleService.create({ ...createArticleDto, content: formattedContent, image: file.filename });
}

  @Get()
//   @UseGuards(JwtAuthGuard) 
  async findAll(@CurrentUser() user: any) {
    console.log(user)
    return this.articleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateArticleDto: Prisma.ArticleUpdateInput) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }

  @Get('author/:author')
  async findByAuthor(@Param('author') author: string) {
    return this.articleService.findByAuthor(author);
  }
}
