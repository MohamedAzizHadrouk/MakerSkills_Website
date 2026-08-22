import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from '../../../products/entities/product.entity';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber?: string;

  // List of purchased products
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }], default: [] })
  items: (Product | Types.ObjectId)[];

  // Indicates whether delivery is requested (defaults to false)
  @Prop({ default: false })
  delivery: boolean;

  // Delivery address when delivery === true (optional)
  @Prop()
  address?: string;

  @Prop()
  note?: string;

  // Delivery method (e.g., 'on-site' or 'delivery')
  @Prop()
  deliveryMethod?: string;

  // Optional order summary fields
  @Prop()
  productName?: string;

  @Prop()
  quantity?: number;

  @Prop()
  unitPrice?: number;

  @Prop()
  totalPrice?: number;

  /**
   * The date the order was placed (optional, defaults to the current date)
   */
  @Prop()
  orderDate?: Date;

  @Prop()
  status?: string;

  @Prop({ default: false })
  withFormation?: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
