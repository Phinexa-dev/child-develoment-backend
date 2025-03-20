import { Prisma } from '@prisma/client';

// export type MedicationCreateInputExtended = Prisma.MedicationCreateInput & {
//   childId: number;
// };

export type MedicationCreateInputExtended = Omit<Prisma.MedicationCreateInput, 'timesOfDays'> & {
    childId: number;
    timesOfDays?: { timeOfDay: string; amount: number }[];
};
