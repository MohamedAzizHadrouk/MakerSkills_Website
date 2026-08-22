import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<{ message: string; data: Category }> {
    try {
      const createdCategory = new this.categoryModel(createCategoryDto);
      const savedCategory = await createdCategory.save();
      return {
        message: 'Category created successfully',
        data: savedCategory,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to create category: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(type?: string): Promise<{ message: string; data: Category[] }> {
    try {
      let categories: Category[];
      console.log('type', type);
      if (!type) {
        categories = await this.categoryModel.find().exec();
      } else {
        categories = await this.categoryModel.find({ type }).exec();
      }
      return {
        message: 'Categories retrieved successfully',
        data: categories,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve categories: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<{ message: string; data: Category }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid category ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const category = await this.categoryModel.findById(id).exec();
      if (!category) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Category not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Category retrieved successfully',
        data: category,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve category: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ message: string; data: Category }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid category ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const updatedCategory = await this.categoryModel
        .findByIdAndUpdate(id, updateCategoryDto, { new: true })
        .exec();
      if (!updatedCategory) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Category not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Category updated successfully',
        data: updatedCategory,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update category: ' + error.message,
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
          message: 'Invalid category ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const deletedCategory = await this.categoryModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedCategory) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Category not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Category deleted successfully',
        data: null,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete category: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
