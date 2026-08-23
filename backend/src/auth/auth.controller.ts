import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

/**
 * Auth Controller - Handles authentication endpoints
 * Only login endpoint as per requirements
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: UserService) {}

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }
}
