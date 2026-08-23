import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import path from 'path';
import os from 'os';
import {
  assignSlugOnCreate,
  assignSlugOnUpdate,
  buildSlugLookupQuery,
} from '../common/utils/slug.util';
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<{ message: string; data: Product }> {
    try {
      // Parser les events si c'est une chaîne JSON
      if (typeof createProductDto.events === 'string') {
        try {
          createProductDto.events = JSON.parse(createProductDto.events);
        } catch (error) {
          createProductDto.events = [];
        }
      }

      const productData = { ...createProductDto } as Record<string, unknown>;
      await assignSlugOnCreate(this.productModel, createProductDto.name, productData);
      const createdProduct = new this.productModel(productData);
      const savedProduct = await createdProduct.save();
      return {
        message: 'Product created successfully',
        data: savedProduct,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to create product: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<{ message: string; data: Product[] }> {
    try {
      const products = await this.productModel
        .find()
        .populate('category')
        .populate('events')
        .exec();
      return {
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve products: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(idOrSlug: string): Promise<{ message: string; data: Product }> {
    try {
      const product = await this.productModel
        .findOne(buildSlugLookupQuery(idOrSlug))
        .populate('category')
        .populate('events')
        .exec();
      if (!product) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Product retrieved successfully',
        data: product,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve product: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<{ message: string; data: Product }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid product ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      // Parser les events si c'est une chaîne JSON
      if (typeof updateProductDto.events === 'string') {
        try {
          updateProductDto.events = JSON.parse(updateProductDto.events);
        } catch (error) {
          updateProductDto.events = [];
        }
      }

      // Get the current product to check if it has images or video
      const currentProduct = await this.productModel.findById(id).exec();
      if (!currentProduct) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const updateData = { ...updateProductDto } as Record<string, unknown>;
      await assignSlugOnUpdate(
        this.productModel,
        id,
        currentProduct.toObject() as unknown as Record<string, unknown>,
        updateData,
        'name',
      );

      // If there are new images and the product had old images, delete the old ones
      if (
        updateProductDto.images &&
        currentProduct.images &&
        currentProduct.images.length > 0
      ) {
        for (const oldImage of currentProduct.images) {
          try {
            const tempDir = os.tmpdir(); // Returns '/tmp' on Vercel
            const oldImagePath = path.join(tempDir, oldImage);
            await unlink(oldImagePath);
          } catch (error) {
            console.log(
              'Old image file not found or already deleted:',
              oldImage,
            );
          }
        }
      }

      // If there's a new video and the product had an old video, delete the old one
      if (updateProductDto.video && currentProduct.video) {
        try {
          const tempDir = os.tmpdir(); // Returns '/tmp' on Vercel
          const oldVideoPath = path.join(tempDir, currentProduct.video);
          await unlink(oldVideoPath);
        } catch (error) {
          console.log('Old video file not found or already deleted');
        }
      }

      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate('category')
        .populate('events')
        .exec();

      if (!updatedProduct) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Product not found after update',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update product: ' + error.message,
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
          message: 'Invalid product ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const deletedProduct = await this.productModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedProduct) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Delete the associated image files if they exist
      if (deletedProduct.images && deletedProduct.images.length > 0) {
        for (const image of deletedProduct.images) {
          try {
            const tempDir = os.tmpdir(); // Returns '/tmp' on Vercel
            const imagePath = path.join(tempDir, image);
            await unlink(imagePath);
          } catch (error) {
            console.log('Image file not found or already deleted:', image);
          }
        }
      }

      // Delete the associated video file if it exists
      if (deletedProduct.video) {
        try {
          const tempDir = os.tmpdir(); // Returns '/tmp' on Vercel
          const videoPath = path.join(tempDir, deletedProduct.video);
          await unlink(videoPath);
        } catch (error) {
          console.log('Video file not found or already deleted');
        }
      }

      return {
        message: 'Product deleted successfully',
        data: null,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete product: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
