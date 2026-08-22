import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateHeroSectionDto } from './dto/create-hero-section.dto';
import { UpdateHeroSectionDto } from './dto/update-hero-section.dto';
import { HeroSection } from './entities/hero-section.entity';

@Injectable()
export class HeroSectionService {
  constructor(
    @InjectModel(HeroSection.name) private heroSectionModel: Model<HeroSection>,
  ) {}

  async create(
    createHeroSectionDto: CreateHeroSectionDto,
  ): Promise<{ message: string; data: HeroSection }> {
    try {
      if (createHeroSectionDto.buttons) {
        createHeroSectionDto.buttons = JSON.parse(
          createHeroSectionDto.buttons as string,
        );
      }
      const created = new this.heroSectionModel(createHeroSectionDto);

      const saved = await created.save();
      return {
        message: 'Hero section created successfully',
        data: saved,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to create hero section: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<{ message: string; data: HeroSection[] }> {
    try {
      const all = await this.heroSectionModel.find().exec();
      return {
        message: 'Hero sections retrieved successfully',
        data: all,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve hero sections: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<{ message: string; data: HeroSection }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid hero section ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const found = await this.heroSectionModel.findById(id).exec();
      if (!found) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Hero section not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Hero section retrieved successfully',
        data: found,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve hero section: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateHeroSectionDto: UpdateHeroSectionDto,
  ): Promise<{ message: string; data: HeroSection }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid hero section ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const updated = await this.heroSectionModel
        .findByIdAndUpdate(id, updateHeroSectionDto, { new: true })
        .exec();
      if (!updated) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Hero section not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Hero section updated successfully',
        data: updated,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update hero section: ' + error.message,
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
          message: 'Invalid hero section ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const deleted = await this.heroSectionModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Hero section not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Hero section deleted successfully',
        data: null,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete hero section: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
