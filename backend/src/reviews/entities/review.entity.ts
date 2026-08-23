import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop()
  image?: string;

  @Prop()
  posteActuelle?: string;

  @Prop({ required: true, min: 1, max: 5 })
  stars: number;

  @Prop({ required: true })
  message: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
