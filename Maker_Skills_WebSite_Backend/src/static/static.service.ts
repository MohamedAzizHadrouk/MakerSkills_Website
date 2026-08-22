import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../products/entities/product.entity';
import { Event } from '../events/entities/event.entity';
import { Order } from '../shop/order/entities/order.entity';
import { Participant } from '../participants/entities/participant.entity';

@Injectable()
export class StaticService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Participant.name) private participantModel: Model<Participant>,
  ) {}

  async getSummary() {
    const [productCount, eventCount, orderCount, participantCount] =
      await Promise.all([
        this.productModel.countDocuments(),
        this.eventModel.countDocuments(),
        this.orderModel.countDocuments(),
        this.participantModel.countDocuments(),
      ]);
    return {
      totalProducts: productCount,
      totalEvents: eventCount,
      totalOrders: orderCount,
      totalParticipants: participantCount,
    };
  }
}
