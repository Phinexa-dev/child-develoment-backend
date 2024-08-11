import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global() //import it once

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService]
})
export class DatabaseModule {}
