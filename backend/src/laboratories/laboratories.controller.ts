import {
  Controller,
  UseInterceptors,
  UploadedFile,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LaboratoriesService } from './laboratories.service';
import {
  CreateLaboratoryDto,
  UpdateLaboratoryDto,
} from './dto/laboratory.dto';
import {
  CreateMaterialDto,
  UpdateMaterialDto,
} from './dto/material.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Laboratory } from './entities/laboratory.entity';
import { Material } from './entities/material.entity';
import { LaboratoryReservation } from './entities/reservation.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CreateLaboratoryReservationDto,
  UpdateLaboratoryReservationDto,
} from './dto/reservation.dto';
import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

@ApiTags('Laboratories')
@Controller('laboratories')
export class LaboratoriesController {
  constructor(
    private readonly laboratoriesService: LaboratoriesService,
  ) {}

  // ========== LABORATORY ENDPOINTS ==========

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/laboratories',
        filename: (_req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Create a new laboratory' })
  @ApiResponse({
    status: 201,
    description: 'Laboratory created successfully',
    type: Laboratory,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({
    description: 'Laboratory creation payload (multipart/form-data)',
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        description: { type: 'string' },
        imageUrl: { type: 'string' },
        hourlyRate: { type: 'number' },
      },
      required: ['title', 'hourlyRate'],
    },
  })
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createLaboratoryDto: CreateLaboratoryDto,
  ) {
    if (file) {
      createLaboratoryDto.coverImagePath = `/uploads/laboratories/${file.filename}`;
    }
    return this.laboratoriesService.create(createLaboratoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all laboratories' })
  @ApiResponse({
    status: 200,
    description: 'List of all laboratories',
    type: [Laboratory],
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by laboratory title or description',
  })
  @ApiQuery({
    name: 'minRate',
    required: false,
    description: 'Minimum hourly rate filter',
    type: Number,
  })
  @ApiQuery({
    name: 'maxRate',
    required: false,
    description: 'Maximum hourly rate filter',
    type: Number,
  })
  findAll(
    @Query('search') search?: string,
    @Query('minRate') minRate?: number,
    @Query('maxRate') maxRate?: number,
  ) {
    const filters: any = {};
    if (search) filters.search = search;
    if (minRate !== undefined) filters.minRate = Number(minRate);
    if (maxRate !== undefined) filters.maxRate = Number(maxRate);
    return this.laboratoriesService.findAll(filters);
  }

  @Get('reservations')
  @ApiOperation({ summary: 'Get all reservations (admin)' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'List of all reservations',
    type: [LaboratoryReservation],
  })
  findAllReservationsAdmin() {
    return this.laboratoriesService.findAllReservations();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get laboratory by ID' })
  @ApiParam({ name: 'id', description: 'Laboratory ID' })
  @ApiResponse({
    status: 200,
    description: 'Laboratory details',
    type: Laboratory,
  })
  @ApiResponse({ status: 404, description: 'Laboratory not found' })
  findOne(@Param('id') id: string) {
    return this.laboratoriesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/laboratories',
        filename: (_req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update laboratory' })
  @ApiParam({ name: 'id', description: 'Laboratory ID' })
  @ApiResponse({
    status: 200,
    description: 'Laboratory updated successfully',
    type: Laboratory,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Laboratory not found' })
  @ApiBody({
    description: 'Laboratory update payload (multipart/form-data)',
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        description: { type: 'string' },
        imageUrl: { type: 'string' },
        hourlyRate: { type: 'number' },
        coverImagePath: { type: 'string' },
      },
    },
  })
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateLaboratoryDto: UpdateLaboratoryDto,
  ) {
    if (file) {
      updateLaboratoryDto.coverImagePath = `/uploads/laboratories/${file.filename}`;
    }
    return this.laboratoriesService.update(id, updateLaboratoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete laboratory' })
  @ApiParam({ name: 'id', description: 'Laboratory ID' })
  @ApiResponse({ status: 200, description: 'Laboratory deleted successfully' })
  @ApiResponse({ status: 404, description: 'Laboratory not found' })
  remove(@Param('id') id: string) {
    return this.laboratoriesService.remove(id);
  }

  // ========== MATERIAL ENDPOINTS ==========

  @UseGuards(JwtAuthGuard)
  @Post(':laboratoryId/materials')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/materials',
        filename: (_req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Create a new material for a laboratory' })
  @ApiParam({ name: 'laboratoryId', description: 'Laboratory ID' })
  @ApiResponse({
    status: 201,
    description: 'Material created successfully',
    type: Material,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Laboratory not found' })
  @ApiBody({
    description: 'Material creation payload (multipart/form-data)',
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
        name: { type: 'string' },
        description: { type: 'string' },
        type: { type: 'string' },
        hourlyRate: { type: 'number' },
        isFree: { type: 'boolean' },
        status: { type: 'string', enum: ['available', 'unavailable', 'maintenance'] },
      },
      required: ['name', 'type', 'isFree', 'status'],
    },
  })
  createMaterial(
    @Param('laboratoryId') laboratoryId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createMaterialDto: CreateMaterialDto,
  ) {
    if (file) {
      createMaterialDto.coverImagePath = `/uploads/materials/${file.filename}`;
    }
    return this.laboratoriesService.createMaterial(laboratoryId, {
      ...createMaterialDto,
      laboratoryId,
    });
  }

  @Get(':laboratoryId/materials')
  @ApiOperation({ summary: 'Get all materials for a laboratory' })
  @ApiParam({ name: 'laboratoryId', description: 'Laboratory ID' })
  @ApiResponse({
    status: 200,
    description: 'List of all materials for the laboratory',
    type: [Material],
  })
  @ApiResponse({ status: 404, description: 'Laboratory not found' })
  findAllMaterials(@Param('laboratoryId') laboratoryId: string) {
    return this.laboratoriesService.findAllMaterials(laboratoryId);
  }

  @Get(':laboratoryId/materials/:materialId')
  @ApiOperation({ summary: 'Get material by ID' })
  @ApiParam({ name: 'laboratoryId', description: 'Laboratory ID' })
  @ApiParam({ name: 'materialId', description: 'Material ID' })
  @ApiResponse({
    status: 200,
    description: 'Material details',
    type: Material,
  })
  @ApiResponse({ status: 404, description: 'Material not found' })
  findOneMaterial(
    @Param('laboratoryId') laboratoryId: string,
    @Param('materialId') materialId: string,
  ) {
    return this.laboratoriesService.findOneMaterial(laboratoryId, materialId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':laboratoryId/materials/:materialId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/materials',
        filename: (_req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Update material' })
  @ApiParam({ name: 'laboratoryId', description: 'Laboratory ID' })
  @ApiParam({ name: 'materialId', description: 'Material ID' })
  @ApiResponse({
    status: 200,
    description: 'Material updated successfully',
    type: Material,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  @ApiBody({
    description: 'Material update payload (multipart/form-data)',
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
        name: { type: 'string' },
        description: { type: 'string' },
        type: { type: 'string' },
        hourlyRate: { type: 'number' },
        isFree: { type: 'boolean' },
        status: { type: 'string', enum: ['available', 'unavailable', 'maintenance'] },
      },
    },
  })
  updateMaterial(
    @Param('laboratoryId') laboratoryId: string,
    @Param('materialId') materialId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    if (file) {
      updateMaterialDto.coverImagePath = `/uploads/materials/${file.filename}`;
    }
    return this.laboratoriesService.updateMaterial(
      laboratoryId,
      materialId,
      updateMaterialDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':laboratoryId/materials/:materialId')
  @ApiOperation({ summary: 'Delete material' })
  @ApiParam({ name: 'laboratoryId', description: 'Laboratory ID' })
  @ApiParam({ name: 'materialId', description: 'Material ID' })
  @ApiResponse({ status: 200, description: 'Material deleted successfully' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  removeMaterial(
    @Param('laboratoryId') laboratoryId: string,
    @Param('materialId') materialId: string,
  ) {
    return this.laboratoriesService.removeMaterial(laboratoryId, materialId);
  }

  // ========== RESERVATION ENDPOINTS ==========

  @Post(':id/reservations')
  @ApiOperation({ summary: 'Create a new reservation for a laboratory' })
  @ApiParam({ name: 'id', description: 'Laboratory ID' })
  @ApiResponse({
    status: 201,
    description: 'Reservation created successfully',
    type: LaboratoryReservation,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Laboratory not found' })
  @ApiBody({ type: CreateLaboratoryReservationDto })
  createReservation(
    @Param('id') laboratoryId: string,
    @Body() createReservationDto: CreateLaboratoryReservationDto,
  ) {
    return this.laboratoriesService.createReservation(
      laboratoryId,
      createReservationDto,
    );
  }

  @Get(':id/reservations')
  @ApiOperation({ summary: 'Get all reservations for a laboratory' })
  @ApiParam({ name: 'id', description: 'Laboratory ID' })
  @ApiResponse({
    status: 200,
    description: 'List of reservations for the laboratory',
    type: [LaboratoryReservation],
  })
  @ApiResponse({ status: 404, description: 'Laboratory not found' })
  findAllReservations(@Param('id') laboratoryId: string) {
    return this.laboratoriesService.findAllReservations(laboratoryId);
  }

  @Get('reservations/:reservationId')
  @ApiOperation({ summary: 'Get reservation by ID' })
  @ApiParam({ name: 'reservationId', description: 'Reservation ID' })
  @ApiResponse({
    status: 200,
    description: 'Reservation details',
    type: LaboratoryReservation,
  })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  findOneReservation(@Param('reservationId') reservationId: string) {
    return this.laboratoriesService.findOneReservation(reservationId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reservations/:reservationId')
  @ApiOperation({ summary: 'Update reservation status' })
  @ApiParam({ name: 'reservationId', description: 'Reservation ID' })
  @ApiResponse({
    status: 200,
    description: 'Reservation updated successfully',
    type: LaboratoryReservation,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @ApiBody({ type: UpdateLaboratoryReservationDto })
  updateReservation(
    @Param('reservationId') reservationId: string,
    @Body() updateReservationDto: UpdateLaboratoryReservationDto,
  ) {
    return this.laboratoriesService.updateReservation(
      reservationId,
      updateReservationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('reservations/:reservationId')
  @ApiOperation({ summary: 'Delete reservation' })
  @ApiParam({ name: 'reservationId', description: 'Reservation ID' })
  @ApiResponse({ status: 200, description: 'Reservation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  removeReservation(@Param('reservationId') reservationId: string) {
    return this.laboratoriesService.removeReservation(reservationId);
  }
}

