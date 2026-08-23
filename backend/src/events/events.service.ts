import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { Event } from './entities/event.entity';
import {
  assignSlugOnCreate,
  assignSlugOnUpdate,
  buildSlugLookupQuery,
} from '../common/utils/slug.util';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async create(
    createEventDto: CreateEventDto,
  ): Promise<{ message: string; data: Event }> {
    try {
      console.log('createdEventdto', createEventDto);
      const eventData = { ...createEventDto } as Record<string, unknown>;
      await assignSlugOnCreate(this.eventModel, createEventDto.name, eventData);
      const createdEvent = new this.eventModel(eventData);
      const savedEvent = await createdEvent.save();
      if (!savedEvent) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message:
              'Failed to create event. Please make sure all fields are valid and try again.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return {
        message: 'Event created successfully',
        data: savedEvent,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to create event: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<{ message: string; data: Event[] }> {
    try {
      const events = await this.eventModel
        .find()
        .populate('participants')
        .populate('category')
        .exec();
      return {
        message: 'Events retrieved successfully',
        data: events,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve events: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(idOrSlug: string): Promise<{ message: string; data: Event }> {
    try {
      const event = await this.eventModel
        .findOne(buildSlugLookupQuery(idOrSlug))
        .populate('participants')
        .populate('category')
        .populate('products')
        .exec();
      if (!event) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Event not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Event retrieved successfully',
        data: event,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve event: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<{ message: string; data: Event }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid event ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const existingEvent = await this.eventModel.findById(id).exec();
      if (!existingEvent) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Event not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const updateData = { ...updateEventDto } as Record<string, unknown>;
      await assignSlugOnUpdate(
        this.eventModel,
        id,
        existingEvent.toObject() as unknown as Record<string, unknown>,
        updateData,
        'name',
      );

      const updatedEvent = await this.eventModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate('participants')
        .exec();

      if (!updatedEvent) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Event not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Event updated successfully',
        data: updatedEvent,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update event: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string): Promise<{ message: string; data: null }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid event ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();
      if (!deletedEvent) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Event not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Event deleted successfully',
        data: null,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete event: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
