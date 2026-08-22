import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../../categories/entities/category.entity';
import { Event } from '../../events/entities/event.entity';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, sparse: true, index: true })
  slug?: string;

  @Prop({ type: [String], default: [] })
  previousSlugs?: string[];

  @Prop()
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Category | Types.ObjectId;

  @Prop([String])
  images?: string[];

  @Prop()
  video?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Event' }], default: [] })
  events?: (Event | Types.ObjectId)[];


}

export const ProductSchema = SchemaFactory.createForClass(Product);
