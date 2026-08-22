import { UpdateProjectDto } from './dto/update-project.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateProjectDto } from './dto/project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
  ): Promise<{ message: string; data: Project }> {
    try {
      // Validate required fields for embedded systems projects 
      const createdProject = new this.projectModel({
        ...createProjectDto,
      });

      const savedProject = await createdProject.save();
      return {
        message: 'Project created successfully',
        data: savedProject,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to create project: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<{ message: string; data: Project[] }> {
    try {
      const projects = await this.projectModel
        .find()
        .populate('categories', 'name')
        .exec();
      return {
        message: 'Projects retrieved successfully',
        data: projects,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve projects: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByCategory(
    category: string,
  ): Promise<{ message: string; data: Project[] }> {
    try {
      const projects = await this.projectModel
        .find({ categories: category })
        .exec();
      return {
        message: `Projects in category ${category} retrieved successfully`,
        data: projects,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            `Failed to retrieve projects in category ${category}: ` +
            error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<{ message: string; data: Project }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid project ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const project = await this.projectModel.findById(id).exec();
      if (!project) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Project not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Project retrieved successfully',
        data: project,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve project: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<{ message: string; data: Project }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid project ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const updatedProject = await this.projectModel
        .findByIdAndUpdate(
          id,
          { ...updateProjectDto, updatedAt: new Date() },
          { new: true },
        )
        .populate('categories')
        .exec();

      if (!updatedProject) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Project not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Project updated successfully',
        data: updatedProject,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update project: ' + error.message,
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
          message: 'Invalid project ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const deletedProject = await this.projectModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedProject) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Project not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Project deleted successfully',
        data: null,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete project: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addImage(
    id: string,
    imageUrl: string,
  ): Promise<{ message: string; data: Project }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid project ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const project = await this.projectModel
        .findByIdAndUpdate(
          id,
          { $push: { galleryImages: imageUrl } },
          { new: true },
        )
        .exec();

      if (!project) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Project not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Image added to project successfully',
        data: project,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to add image to project: ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async search(query: string): Promise<{ message: string; data: Project[] }> {
    try {
      const projects = await this.projectModel
        .find({
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tagline: { $regex: query, $options: 'i' } },
            { technologies: { $regex: query, $options: 'i' } },
          ],
        })
        .exec();

      return {
        message: 'Projects search completed successfully',
        data: projects,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to search projects: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
