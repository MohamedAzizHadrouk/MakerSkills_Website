import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserSeederService } from './user.seeder.service';
import { UserService } from './auth.service';

// Only enable this controller in development
@Controller('dev/users')
@ApiTags('development')
export class DevUserController {
  constructor(
    private readonly userSeederService: UserSeederService,
    private readonly userService: UserService,
  ) {}

  @Post('seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Seed default users (Development only)' })
  @ApiResponse({
    status: 200,
    description: 'Default users created successfully',
  })
  async seedUsers() {
    await this.userSeederService.createDefaultUsers();
    return {
      message: 'Default users seeded successfully',
      users: [
        { email: 'admin@makerskills.com', password: 'admin123' },
        { email: 'user@makerskills.com', password: 'user123' },
        { email: 'demo@example.com', password: 'demo123' },
      ],
    };
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset all users (Development only)' })
  @ApiResponse({
    status: 200,
    description: 'All users reset successfully',
  })
  async resetUsers() {
    await this.userSeederService.resetUsers();
    return {
      message: 'All users reset and default users created',
      users: [
        { email: 'admin@makerskills.com', password: 'admin123' },
        { email: 'user@makerskills.com', password: 'user123' },
        { email: 'demo@example.com', password: 'demo123' },
      ],
    };
  }

  @Post('create-test')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a test user (Development only)' })
  @ApiResponse({
    status: 201,
    description: 'Test user created successfully',
  })
  async createTestUser(
    @Body() body: { email: string; password: string; name?: string },
  ) {
    const user = await this.userSeederService.createTestUser(
      body.email,
      body.password,
      body.name,
    );
    return {
      message: 'Test user created successfully',
      user: {
        email: user.email,
        name: user.name,
        id: user._id,
      },
    };
  }

  @Get('quick-user')
  @ApiOperation({ summary: 'Get quick login credentials (Development only)' })
  @ApiResponse({
    status: 200,
    description: 'Quick login credentials',
  })
  async getQuickLoginCredentials() {
    return {
      message: 'Quick login credentials for testing',
      users: [
        {
          email: 'admin@makerskills.com',
          password: 'admin123',
          name: 'Admin User',
          description: 'Administrator account',
        },
        {
          email: 'user@makerskills.com',
          password: 'user123',
          name: 'Test User',
          description: 'Regular user account',
        },
        {
          email: 'demo@example.com',
          password: 'demo123',
          name: 'Demo User',
          description: 'Demo account for testing',
        },
      ],
    };
  }
}
