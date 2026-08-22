import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './entities/user.entity';
import { UserSeederService } from './user.seeder.service';
import { DevUserController } from './dev.user.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '365d' },
    }),
  ],
  controllers: [
    AuthController,
    ...(process.env.NODE_ENV !== 'production' ? [DevUserController] : []),
  ],
  providers: [UserService, UserSeederService, JwtAuthGuard, JwtStrategy],
  exports: [UserService, JwtModule, JwtAuthGuard],
})
export class AuthModule {}
