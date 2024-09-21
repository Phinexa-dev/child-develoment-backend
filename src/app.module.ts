import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SchoolsModule } from './schools/schools.module';
import { ParentModule } from './parent/parent.module';
import { AuthModule } from './auth/auth.module';
import { ChildModule } from './child/child.module';
import { GrowthModule } from './growth/growth.module';
import { SleepModule } from './sleep/sleep.module';
import { ArticleModule } from './article/article.module';
import { NurseModule } from './feeding/nurse/nurse.module';
import { MilkTypeModule } from './feeding/milk-type/milk-type.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigModule available throughout the app without importing it in other modules
      envFilePath: '.env', // Path to your .env file, you can also specify multiple paths in an array
    }),
    DatabaseModule,
    SchoolsModule,
    ParentModule,
    AuthModule,
    ChildModule,
    GrowthModule,
    SleepModule,
   ArticleModule,
   NurseModule,
   MilkTypeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
