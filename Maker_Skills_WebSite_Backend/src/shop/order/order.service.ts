import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async create(
    createOrderDto: CreateOrderDto,
  ): Promise<{ message: string; data: Order }> {
    try {
      // Calcul simple du totalPrice
      let totalPrice = 0;
      if (createOrderDto.unitPrice && createOrderDto.quantity) {
        totalPrice = createOrderDto.unitPrice * createOrderDto.quantity;
      }
      createOrderDto.totalPrice = totalPrice;
      const created = new this.orderModel(createOrderDto);
      const saved = await created.save();
      return { message: 'Order created successfully', data: saved };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to create order: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<{ message: string; data: Order[] }> {
    try {
      const orders = await this.orderModel
        .find()
        .populate({
          path: 'items',
          populate: {
            path: 'category',
            model: 'Category',
          },
        })
        .exec();
      return { message: 'Orders retrieved successfully', data: orders };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve orders: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<{ message: string; data: Order }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid order ID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const order = await this.orderModel.findById(id).populate('items').exec();
      if (!order) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'Order not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: 'Order retrieved successfully', data: order };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve order: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<{ message: string; data: Order }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid order ID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const updated = await this.orderModel
        .findByIdAndUpdate(id, updateOrderDto, { new: true })
        .populate('items')
        .exec();
      if (!updated) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'Order not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: 'Order updated successfully', data: updated };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update order: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid order ID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const res = await this.orderModel.findByIdAndDelete(id).exec();
      if (!res) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'Order not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: 'Order removed successfully' };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove order: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
