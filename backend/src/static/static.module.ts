import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StaticService } from './static.service';
import { StaticController } from './static.controller';
import { Product, ProductSchema } from '../products/entities/product.entity';
import { Event, EventSchema } from '../events/entities/event.entity';
import { Order, OrderSchema } from '../shop/order/entities/order.entity';
import {
  Participant,
  ParticipantSchema,
} from '../participants/entities/participant.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Event.name, schema: EventSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Participant.name, schema: ParticipantSchema },
    ]),
  ],
  controllers: [StaticController],
  providers: [StaticService],
})
export class StaticModule {}
