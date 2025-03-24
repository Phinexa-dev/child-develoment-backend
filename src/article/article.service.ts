import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ArticleService {
  constructor(private readonly databaseService: DatabaseService, private readonly configService: ConfigService) {}

  // Create a new article
  async create(createArticleDto: Prisma.ArticleCreateInput) {
    return this.databaseService.article.create({
      data: createArticleDto,
    });
  }

  // Find all articles
  async findAll() {
    const baseUrl = this.configService.get<string>('ENV'); // Get the base URL from env

    const articles = await this.databaseService.article.findMany({});

    return articles.map(article => ({
      ...article,
      image: article.image ? `${baseUrl}/articles/${article.image}` : null, // Prepend base URL
    }));
    return this.databaseService.article.findMany({});
  }

  // Find one article by ID
  async findOne(articleId: number) {
    const article = await this.databaseService.article.findUnique({
      where: {
        articleId,
      },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  // Update an article by ID
  async update(articleId: number, updateArticleDto: Prisma.ArticleUpdateInput) {
    return this.databaseService.article.update({
      where: {
        articleId,
      },
      data: updateArticleDto,
    });
  }

  // Delete an article by ID
  async remove(articleId: number) {
    return this.databaseService.article.delete({
      where: { articleId },
    });
  }

  // Find articles by a specific author
  async findByAuthor(author: string) {
    return this.databaseService.article.findMany({
      where: {
        author,
      },
    });
  }
}
