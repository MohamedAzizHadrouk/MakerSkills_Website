import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import {
  CreateServiceDto,
  UpdateServiceDto,
  AddCategoriesDto,
  UpdateStatusDto,
} from './dto/service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<Service>,
  ) {}

  async create(
    createServiceDto: CreateServiceDto,
  ): Promise<{ message: string; data: Service }> {
    try {
      const createdService = new this.serviceModel({
        ...createServiceDto,
        isActive: createServiceDto.isActive ?? true,
        categories: createServiceDto.categories ?? [],
        projects: createServiceDto.projects ?? [],
        products: createServiceDto.products ?? [],
        events: createServiceDto.events ?? [],
      });
      const savedService = await createdService.save();
      return {
        message: 'Service created successfully',
        data: savedService,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to create service: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(filters?: {
    category?: string;
    active?: boolean;
    search?: string;
  }): Promise<{ message: string; data: Service[] }> {
    try {
      const query: any = {};

      if (filters?.category) {
        query.categories = filters.category;
      }

      if (filters?.active !== undefined) {
        query.isActive = filters.active;
      }

      if (filters?.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
        ];
      }

      const services = await this.serviceModel
        .find(query)
        .populate('categories')
        .populate('products')
        .populate('events')
        .populate('projects')
        .exec();
      return {
        message: 'Services retrieved successfully',
        data: services,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve services: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<{ message: string; data: Service }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid service ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const service = await this.serviceModel
        .findById(id)
        .populate('categories')
        .populate('products')
        .populate('events')
        .populate('projects')
        .exec();
      if (!service) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Service not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Service retrieved successfully',
        data: service,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve service: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<{ message: string; data: Service }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid service ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const updatedService = await this.serviceModel
        .findByIdAndUpdate(
          id,
          {
            ...updateServiceDto,
            updatedAt: new Date(),
            ...(updateServiceDto.categories && {
              categories: updateServiceDto.categories,
            }),
            ...(updateServiceDto.projects && {
              projects: updateServiceDto.projects,
            }),
            ...(updateServiceDto.products && {
              products: updateServiceDto.products,
            }),
            ...(updateServiceDto.events && { events: updateServiceDto.events }),
          },
          { new: true },
        )
        .populate('categories')
        .populate('projects')
        .populate('products')
        .populate('events')
        .exec();

      if (!updatedService) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Service not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Service updated successfully',
        data: updatedService,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update service: ' + error.message,
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
          message: 'Invalid service ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const deletedService = await this.serviceModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedService) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Service not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Service deleted successfully',
        data: null,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete service: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addCategories(
    id: string,
    addCategoriesDto: AddCategoriesDto,
  ): Promise<{ message: string; data: Service }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid service ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const updatedService = await this.serviceModel
        .findByIdAndUpdate(
          id,
          { $addToSet: { categories: { $each: addCategoriesDto.categories } } },
          { new: true },
        )
        .populate('categories')
        .exec();

      if (!updatedService) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Service not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Categories added to service successfully',
        data: updatedService,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to add categories: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeCategory(
    id: string,
    categoryId: string,
  ): Promise<{ message: string; data: Service }> {
    if (!isValidObjectId(id) || !isValidObjectId(categoryId)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid service ID or category ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const updatedService = await this.serviceModel
        .findByIdAndUpdate(
          id,
          { $pull: { categories: categoryId } },
          { new: true },
        )
        .populate('categories')
        .exec();

      if (!updatedService) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Service not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Category removed from service successfully',
        data: updatedService,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to remove category: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateStatusDto,
  ): Promise<{ message: string; data: Service }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid service ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const updatedService = await this.serviceModel
        .findByIdAndUpdate(
          id,
          { isActive: updateStatusDto.isActive },
          { new: true },
        )
        .populate('categories')
        .exec();

      if (!updatedService) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Service not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Service status updated successfully',
        data: updatedService,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update status: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getRelatedServices(
    id: string,
  ): Promise<{ message: string; data: Service[] }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid service ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const service = await this.serviceModel.findById(id).exec();
      if (!service) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Service not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const relatedServices = await this.serviceModel
        .find({
          categories: { $in: service.categories },
          _id: { $ne: service._id },
          isActive: true,
        })
        .limit(5)
        .populate('categories')
        .exec();

      return {
        message: 'Related services retrieved successfully',
        data: relatedServices,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to get related services: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
