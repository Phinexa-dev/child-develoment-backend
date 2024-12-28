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
import { BottleModule } from './feeding/bottle/bottle.module';
import { CategoryModule } from './feeding/category/category.module';
import { CategoryItemModule } from './feeding/category-item/category-item.module';
import { SolidModule } from './feeding/solid/solid.module';
import { SolidcatModule } from './feeding/solidcat/solidcat.module';
import { MedicineModule } from './medicineDef/medicine.module';
import { MedicineCusModule } from './medicine-cus/medicine-cus.module';
import { MedicationModule } from './medication/medication.module';
import { MedicationSlotModule } from './medication-slot/medication-slot.module';
import { AllergiesModule } from './allergies/allergies.module';
import { VaccineModule } from './vaccine/vaccine.module';
import { VaccinationModule } from './vaccination/vaccination.module';
import { PostSymptomModule } from './post-symptom/post-symptom.module';
import { SymptomModule } from './symptom/symptom.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DocAppointmentsModule } from './doc-appointments/doc-appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigModule available throughout the app without importing it in other modules
      envFilePath: '.env', // Path to your .env file, you can also specify multiple paths in an array
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Serve files from 'uploads' folder
      serveRoot: '/uploads', // Accessible at '/uploads' URL
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
   MilkTypeModule,
   BottleModule,
   CategoryModule,
   CategoryItemModule,
   SolidModule,
   SolidcatModule,
   MedicineModule,
   MedicineCusModule,
   MedicationModule,
   MedicationSlotModule,
   AllergiesModule,
   VaccineModule,
   VaccinationModule,
   PostSymptomModule,
   SymptomModule,
   DocAppointmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
