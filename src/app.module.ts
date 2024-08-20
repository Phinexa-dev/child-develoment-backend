import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SchoolsModule } from './schools/schools.module';
import { ParentModule } from './parent/parent.module';

@Module({
  imports: [DatabaseModule, SchoolsModule, ParentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
