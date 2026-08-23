import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import {
  CreateUserDto,
  LoginUserDto,
  UserResponseDto,
  LoginResponseDto,
} from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Create new user (password will be hashed by the pre-save hook)
      const newUser = new this.userModel(createUserDto);
      const savedUser = await newUser.save();

      // Return user without password
      return this.toUserResponse(savedUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Error creating user: ' + error.message);
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto | null> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return null;
      }

      // Compare password using the schema method
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      return this.toUserResponse(user);
    } catch (error) {
      throw new Error('Error validating user: ' + error.message);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async findById(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.toUserResponse(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error finding user: ' + error.message);
    }
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    try {
      const user = await this.userModel.findOne({ email });
      return user ? this.toUserResponse(user) : null;
    } catch (error) {
      throw new Error('Error finding user by email: ' + error.message);
    }
  }

  async updatePassword(
    userId: string,
    newPassword: string,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Update password (will be hashed by pre-save hook)
      user.password = newPassword;
      const updatedUser = await user.save();

      return this.toUserResponse(updatedUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error updating password: ' + error.message);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const result = await this.userModel.findByIdAndDelete(userId);
      if (!result) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error deleting user: ' + error.message);
    }
  }

  // Helper method to convert User document to UserResponseDto
  private toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Method to hash password manually (if needed outside of schema)
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  // Method to compare password manually (if needed outside of schema)
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
