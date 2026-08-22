import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async create(
    createReviewDto: CreateReviewDto,
  ): Promise<{ message: string; data: Review }> {
    try {
      const createdReview = new this.reviewModel(createReviewDto);
      const savedReview = await createdReview.save();
      return {
        message: 'Review created successfully',
        data: savedReview,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to create review: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<{ message: string; data: Review[] }> {
    try {
      const reviews = await this.reviewModel.find().exec();
      return {
        message: 'Reviews retrieved successfully',
        data: reviews,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve reviews: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<{ message: string; data: Review }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid review ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const review = await this.reviewModel.findById(id).exec();
      if (!review) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Review not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Review retrieved successfully',
        data: review,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve review: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<{ message: string; data: Review }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid review ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const updatedReview = await this.reviewModel
        .findByIdAndUpdate(id, updateReviewDto, { new: true })
        .exec();
      if (!updatedReview) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Review not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Review updated successfully',
        data: updatedReview,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update review: ' + error.message,
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
          message: 'Invalid review ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const deletedReview = await this.reviewModel.findByIdAndDelete(id).exec();
      if (!deletedReview) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Review not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Review deleted successfully',
        data: null,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete review: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
