import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(@Body() createArticleDto: Prisma.ArticleCreateInput) {
    return this.articleService.create(createArticleDto);
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
