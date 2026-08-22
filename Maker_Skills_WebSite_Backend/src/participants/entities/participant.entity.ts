import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from '../../events/entities/event.entity';

/**
 * Participant Entity
 * A participant can join multiple events and workshops
 * But can only join each specific event/workshop once (enforced by service logic)
 */
@Schema({ timestamps: true })
export class Participant extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  address?: string;

  @Prop()
  organizationName?: string;

  @Prop()
  city?: string;

  @Prop()
  country?: string;

  // Optional reference to Event - participant can belong to an event
  @Prop({ type: Types.ObjectId, ref: 'Event', required: false })
  event?: Event | Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);

// Optional: Add compound index for better query performance
// This index improves query speed but doesn't enforce uniqueness
ParticipantSchema.index({ email: 1, event: 1 });