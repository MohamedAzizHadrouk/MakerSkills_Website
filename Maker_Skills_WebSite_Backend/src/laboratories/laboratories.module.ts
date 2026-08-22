import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LaboratoriesService } from './laboratories.service';
import { LaboratoriesController } from './laboratories.controller';
import { Laboratory, LaboratorySchema } from './entities/laboratory.entity';
import { Material, MaterialSchema } from './entities/material.entity';
import {
  LaboratoryReservation,
  LaboratoryReservationSchema,
} from './entities/reservation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Laboratory.name, schema: LaboratorySchema },
      { name: Material.name, schema: MaterialSchema },
      { name: LaboratoryReservation.name, schema: LaboratoryReservationSchema },
    ]),
  ],
  controllers: [LaboratoriesController],
  providers: [LaboratoriesService],
  exports: [LaboratoriesService],
})
export class LaboratoriesModule {}

