import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Parent, Prisma } from '@prisma/client';
import { MedicationCreateInputExtended } from './dto/create-medication-dto';

@Controller('medication')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createMedicationDto: MedicationCreateInputExtended,
    @CurrentUser() parent: Parent,
    // @Param('childId') childId: string,
  ) {
    const { childId, timesOfDays, startDate, endDate, interval, ...medicationData } = createMedicationDto;

    if (!childId || isNaN(Number(childId))) {
      throw new BadRequestException('Invalid childId format.');
    }

    // Parsing the start and end dates (assumed to be in UTC)
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Generate medication slots
    const medicationSlots = [];

    for (let currentDate = start; currentDate <= end; currentDate.setUTCDate(currentDate.getUTCDate() + interval)) {
      for (const timeSlot of timesOfDays) {
        // Combine the current date with the time from the request
        const dateTime = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()));
        // const [hour, minute, second] = timeSlot.dayTime.split(':').map(Number);
        
        // Set the correct hour, minute, and second
        dateTime.setUTCHours(0, 0, 0, 0); // Ensure time is set in UTC
        
        // Push the slot with the combined date and time in UTC format
        medicationSlots.push({
          timeOfDay: timeSlot.timeOfDay, 
          date: dateTime.toISOString(), // Returns the UTC time as 'yyyy-MM-ddTHH:mm:ss.sssZ'
          amount: timeSlot.amount,
        });
      }
    }

    // Prepare the prisma data object
    const prismaData: Prisma.MedicationCreateInput = {
      ...medicationData,
      startDate: startDate,
      endDate: endDate,
      interval: interval,
      child: { connect: { childId: Number(childId) } },
      timesOfDays: {
        create: medicationSlots, // Creating medication slots as an array
      },
    };

    return this.medicationService.create(prismaData, parent.parentId);
  }

  @Get('child/:childId')
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser() parent: Parent,
    @Param('childId') childId: string
  ) {
    const childIdNumber = parseInt(childId, 10);

    if (isNaN(childIdNumber)) {
      throw new BadRequestException('Invalid childId format.');
    }
    return this.medicationService.findAll(parent.parentId, childIdNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id') id: string,
    @CurrentUser() parent: Parent,
  ) {
    return this.medicationService.findOne(+id,parent.parentId,);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @CurrentUser() parent: Parent,
    @Body() updateMedicationDto: Prisma.MedicationUpdateInput) {
    return this.medicationService.update(+id, updateMedicationDto,parent.parentId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
  @Param('id') id: string,
  @CurrentUser() parent: Parent,) {
    return this.medicationService.remove(+id,parent.parentId);
  }
}
