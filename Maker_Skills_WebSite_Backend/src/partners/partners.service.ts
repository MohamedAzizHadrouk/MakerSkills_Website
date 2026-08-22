import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Partner } from './entities/partner.entity';

@Injectable()
export class PartnersService {
  constructor(
    @InjectModel(Partner.name) private partnerModel: Model<Partner>,
  ) {}

  async create(
    createPartnerDto: CreatePartnerDto,
  ): Promise<{ message: string; data: Partner }> {
    try {
      const createdPartner = new this.partnerModel(createPartnerDto);
      const savedPartner = await createdPartner.save();
      return {
        message: 'Partner created successfully',
        data: savedPartner,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to create partner: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<{ message: string; data: Partner[] }> {
    try {
      const partners = await this.partnerModel.find().exec();
      return {
        message: 'Partners retrieved successfully',
        data: partners,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve partners: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<{ message: string; data: Partner }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid partner ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const partner = await this.partnerModel.findById(id).exec();
      if (!partner) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Partner not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Partner retrieved successfully',
        data: partner,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve partner: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<{ message: string; data: Partner }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid partner ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const current = await this.partnerModel.findById(id).exec();
      if (!current) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Partner not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      // Vérifie si les champs sont identiques
      const isSame =
        (updatePartnerDto.name === undefined ||
          current.name === updatePartnerDto.name) &&
        (updatePartnerDto.specialite === undefined ||
          current.specialite === updatePartnerDto.specialite) &&
        (updatePartnerDto.logo === undefined ||
          current.logo === updatePartnerDto.logo) &&
        (updatePartnerDto.website === undefined ||
          current.website === updatePartnerDto.website);
      if (isSame) {
        return {
          message: 'Aucune modification détectée',
          data: current,
        };
      }
      const updatedPartner = await this.partnerModel
        .findByIdAndUpdate(id, updatePartnerDto, { new: true })
        .exec();
      if (!updatedPartner) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Partner not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Partner updated successfully',
        data: updatedPartner,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update partner: ' + error.message,
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
          message: 'Invalid partner ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const deletedPartner = await this.partnerModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedPartner) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Partner not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Partner deleted successfully',
        data: null,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete partner: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
