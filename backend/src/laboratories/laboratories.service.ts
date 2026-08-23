import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import {
  CreateLaboratoryDto,
  UpdateLaboratoryDto,
} from './dto/laboratory.dto';
import {
  CreateMaterialDto,
  UpdateMaterialDto,
} from './dto/material.dto';
import { Laboratory } from './entities/laboratory.entity';
import { Material } from './entities/material.entity';
import {
  LaboratoryReservation,
  ReservationStatus,
} from './entities/reservation.entity';
import {
  CreateLaboratoryReservationDto,
  UpdateLaboratoryReservationDto,
} from './dto/reservation.dto';
import {
  assignSlugOnCreate,
  assignSlugOnUpdate,
  buildSlugLookupQuery,
} from '../common/utils/slug.util';

@Injectable()
export class LaboratoriesService {
  constructor(
    @InjectModel(Laboratory.name) private laboratoryModel: Model<Laboratory>,
    @InjectModel(Material.name) private materialModel: Model<Material>,
    @InjectModel(LaboratoryReservation.name)
    private reservationModel: Model<LaboratoryReservation>,
  ) {}

  // ========== LABORATORY CRUD ==========

  async create(
    createLaboratoryDto: CreateLaboratoryDto,
  ): Promise<{ message: string; data: Laboratory }> {
    try {
      console.log('Creating laboratory with data:', createLaboratoryDto);
      const laboratoryData = { ...createLaboratoryDto } as Record<string, unknown>;
      await assignSlugOnCreate(
        this.laboratoryModel,
        createLaboratoryDto.title,
        laboratoryData,
      );
      const createdLaboratory = new this.laboratoryModel(laboratoryData);
      const savedLaboratory = await createdLaboratory.save();
      console.log('Laboratory created successfully:', savedLaboratory._id);
      return {
        message: 'Laboratory created successfully',
        data: savedLaboratory,
      };
    } catch (error) {
      console.error('Error creating laboratory:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to create laboratory: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(filters?: {
    search?: string;
    minRate?: number;
    maxRate?: number;
  }): Promise<{ message: string; data: Laboratory[] }> {
    try {
      const query: any = {};

      if (filters?.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
        ];
      }

      if (filters?.minRate !== undefined) {
        query.hourlyRate = { ...query.hourlyRate, $gte: filters.minRate };
      }

      if (filters?.maxRate !== undefined) {
        query.hourlyRate = { ...query.hourlyRate, $lte: filters.maxRate };
      }

      const laboratories = await this.laboratoryModel
        .find(query)
        .populate('materials')
        .exec();
      return {
        message: 'Laboratories retrieved successfully',
        data: laboratories,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve laboratories: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(idOrSlug: string): Promise<{ message: string; data: Laboratory }> {
    try {
      const laboratory = await this.laboratoryModel
        .findOne(buildSlugLookupQuery(idOrSlug))
        .populate('materials')
        .exec();
      if (!laboratory) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Laboratory not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Laboratory retrieved successfully',
        data: laboratory,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve laboratory: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateLaboratoryDto: UpdateLaboratoryDto,
  ): Promise<{ message: string; data: Laboratory }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid laboratory ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const existingLaboratory = await this.laboratoryModel.findById(id).exec();
      if (!existingLaboratory) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Laboratory not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const updateData = {
        ...updateLaboratoryDto,
        updatedAt: new Date(),
      } as Record<string, unknown>;
      await assignSlugOnUpdate(
        this.laboratoryModel,
        id,
        existingLaboratory.toObject() as unknown as Record<string, unknown>,
        updateData,
        'title',
      );

      const updatedLaboratory = await this.laboratoryModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate('materials')
        .exec();

      if (!updatedLaboratory) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Laboratory not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Laboratory updated successfully',
        data: updatedLaboratory,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update laboratory: ' + error.message,
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
          message: 'Invalid laboratory ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      // Delete all materials associated with this laboratory
      await this.materialModel.deleteMany({ laboratoryId: id }).exec();

      const deletedLaboratory = await this.laboratoryModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedLaboratory) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Laboratory not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Laboratory deleted successfully',
        data: null,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete laboratory: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ========== MATERIAL CRUD ==========

  async createMaterial(
    laboratoryId: string,
    createMaterialDto: CreateMaterialDto,
  ): Promise<{ message: string; data: Material }> {
    if (!isValidObjectId(laboratoryId)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid laboratory ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verify laboratory exists
    const laboratory = await this.laboratoryModel.findById(laboratoryId).exec();
    if (!laboratory) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Laboratory not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const createdMaterial = new this.materialModel({
        ...createMaterialDto,
        laboratoryId,
        // If material is free, set hourlyRate to undefined
        hourlyRate: createMaterialDto.isFree ? undefined : createMaterialDto.hourlyRate,
      });
      const savedMaterial = await createdMaterial.save();

      // Add material to laboratory's materials array
      await this.laboratoryModel.findByIdAndUpdate(
        laboratoryId,
        { $addToSet: { materials: savedMaterial._id } },
        { new: true },
      ).exec();

      return {
        message: 'Material created successfully',
        data: savedMaterial,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to create material: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllMaterials(
    laboratoryIdOrSlug: string,
  ): Promise<{ message: string; data: Material[] }> {
    const laboratoryResult = await this.findOne(laboratoryIdOrSlug);
    const laboratoryId = String(laboratoryResult.data._id);

    try {
      const materials = await this.materialModel
        .find({ laboratoryId })
        .exec();
      return {
        message: 'Materials retrieved successfully',
        data: materials,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve materials: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneMaterial(
    laboratoryId: string,
    materialId: string,
  ): Promise<{ message: string; data: Material }> {
    if (!isValidObjectId(laboratoryId) || !isValidObjectId(materialId)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid laboratory ID or material ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const material = await this.materialModel
        .findOne({ _id: materialId, laboratoryId })
        .exec();

      if (!material) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Material not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Material retrieved successfully',
        data: material,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve material: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateMaterial(
    laboratoryId: string,
    materialId: string,
    updateMaterialDto: UpdateMaterialDto,
  ): Promise<{ message: string; data: Material }> {
    if (!isValidObjectId(laboratoryId) || !isValidObjectId(materialId)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid laboratory ID or material ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // If isFree is being set to true, remove hourlyRate
      if (updateMaterialDto.isFree === true) {
        updateMaterialDto.hourlyRate = undefined;
      }

      const updatedMaterial = await this.materialModel
        .findOneAndUpdate(
          { _id: materialId, laboratoryId },
          {
            ...updateMaterialDto,
            updatedAt: new Date(),
            // If material is free, ensure hourlyRate is undefined
            ...(updateMaterialDto.isFree === true && { hourlyRate: undefined }),
          },
          { new: true },
        )
        .exec();

      if (!updatedMaterial) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Material not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Material updated successfully',
        data: updatedMaterial,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update material: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeMaterial(
    laboratoryId: string,
    materialId: string,
  ): Promise<{ message: string; data: null }> {
    if (!isValidObjectId(laboratoryId) || !isValidObjectId(materialId)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid laboratory ID or material ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const deletedMaterial = await this.materialModel
        .findOneAndDelete({ _id: materialId, laboratoryId })
        .exec();

      if (!deletedMaterial) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Material not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Remove material from laboratory's materials array
      await this.laboratoryModel.findByIdAndUpdate(
        laboratoryId,
        { $pull: { materials: materialId } },
        { new: true },
      ).exec();

      return {
        message: 'Material deleted successfully',
        data: null,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete material: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ========== RESERVATION CRUD ==========

  async createReservation(
    laboratoryIdOrSlug: string,
    createReservationDto: CreateLaboratoryReservationDto,
  ): Promise<{ message: string; data: LaboratoryReservation }> {
    const laboratoryResult = await this.findOne(laboratoryIdOrSlug);
    const laboratory = laboratoryResult.data;
    const laboratoryId = String(laboratory._id);

    try {
      let totalCost = 0;

      // Calculate hours between start and end time on the same day
      // Parse time strings (format: "HH:mm")
      const [startHours, startMinutes] = createReservationDto.startTime.split(':').map(Number);
      const [endHours, endMinutes] = createReservationDto.endTime.split(':').map(Number);
      
      // Convert to total minutes
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      
      // Calculate difference in minutes, then convert to hours
      const diffMinutes = endTotalMinutes - startTotalMinutes;
      const hours = diffMinutes / 60;
      
      // Ensure minimum 1 hour and positive value
      if (hours <= 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'L\'heure de fin doit être après l\'heure de début',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Calculate laboratory cost: hourly rate × number of hours
      const laboratoryCost = laboratory.hourlyRate * hours;
      totalCost += laboratoryCost;

      // Add materials cost if selected
      // For each material: material hourly rate × number of hours
      if (createReservationDto.materials && createReservationDto.materials.length > 0) {
        const materials = await this.materialModel
          .find({
            _id: { $in: createReservationDto.materials },
            laboratoryId,
          })
          .exec();

        materials.forEach((material) => {
          // Only charge for non-free materials
          if (!material.isFree && material.hourlyRate) {
            const materialCost = material.hourlyRate * hours;
            totalCost += materialCost;
          }
        });
      }

      // Create reservation
      const reservation = new this.reservationModel({
        ...createReservationDto,
        laboratoryId,
        materials: createReservationDto.materials || [],
        reservationDate: new Date(createReservationDto.reservationDate),
        totalCost: Math.round(totalCost * 100) / 100, // Round to 2 decimals
        status: ReservationStatus.PENDING,
      });

      const savedReservation = await reservation.save();

      // Populate references for response
      await savedReservation.populate('laboratoryId');
      await savedReservation.populate('materials');

      return {
        message: 'Reservation created successfully',
        data: savedReservation,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to create reservation: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllReservations(laboratoryId?: string): Promise<{
    message: string;
    data: LaboratoryReservation[];
  }> {
    try {
      const query: any = {};
      if (laboratoryId) {
        if (!isValidObjectId(laboratoryId)) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Invalid laboratory ID',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        query.laboratoryId = laboratoryId;
      }

      const reservations = await this.reservationModel
        .find(query)
        .populate('laboratoryId')
        .populate('materials')
        .sort({ createdAt: -1 })
        .exec();

      return {
        message: 'Reservations retrieved successfully',
        data: reservations,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve reservations: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneReservation(
    id: string,
  ): Promise<{ message: string; data: LaboratoryReservation }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid reservation ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const reservation = await this.reservationModel
        .findById(id)
        .populate('laboratoryId')
        .populate('materials')
        .exec();

      if (!reservation) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Reservation not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Reservation retrieved successfully',
        data: reservation,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve reservation: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateReservation(
    id: string,
    updateReservationDto: UpdateLaboratoryReservationDto,
  ): Promise<{ message: string; data: LaboratoryReservation }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid reservation ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const updatedReservation = await this.reservationModel
        .findByIdAndUpdate(
          id,
          {
            ...updateReservationDto,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .populate('laboratoryId')
        .populate('materials')
        .exec();

      if (!updatedReservation) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Reservation not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Reservation updated successfully',
        data: updatedReservation,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update reservation: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeReservation(
    id: string,
  ): Promise<{ message: string; data: null }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid reservation ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const deletedReservation = await this.reservationModel
        .findByIdAndDelete(id)
        .exec();

      if (!deletedReservation) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Reservation not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Reservation deleted successfully',
        data: null,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete reservation: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

