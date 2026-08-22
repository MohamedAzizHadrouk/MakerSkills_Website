import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeederService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async onModuleInit() {
    await this.createDefaultUsers();
  }

  async createDefaultUsers() {
    try {
      // Check if default users already exist
      const existingUsers = await this.userModel.countDocuments();

      if (existingUsers > 0) {
        console.log('Users already exist, skipping seeding...');
        return;
      }

      // Default users to create
      const defaultUsers = [
        {
          email: 'admin@makerskills.com',
          password: 'admin123',
          name: 'Admin User',
        },
        {
          email: 'user@makerskills.com',
          password: 'user123',
          name: 'Test User',
        },
        {
          email: 'demo@example.com',
          password: 'demo123',
          name: 'Demo User',
        },
      ];

      // Create users
      for (const userData of defaultUsers) {
        const user = new this.userModel(userData);
        await user.save();
        console.log(`✅ Created user: ${userData.email}`);
      }

      console.log('🎉 Default users created successfully!');
      console.log('\n📋 Login Credentials:');
      console.log('👤 Admin: admin@makerskills.com / admin123');
      console.log('👤 User: user@makerskills.com / user123');
      console.log('👤 Demo: demo@example.com / demo123');
    } catch (error) {
      console.error('❌ Error seeding users:', error);
    }
  }

  // Method to manually create a user (for testing)
  async createTestUser(email: string, password: string, name?: string) {
    try {
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        console.log(`User ${email} already exists`);
        return existingUser;
      }

      const user = new this.userModel({
        email,
        password,
        name: name || 'Test User',
      });

      await user.save();
      console.log(`✅ Test user created: ${email}`);
      return user;
    } catch (error) {
      console.error('❌ Error creating test user:', error);
      throw error;
    }
  }

  // Method to reset all users (for development)
  async resetUsers() {
    try {
      await this.userModel.deleteMany({});
      console.log('🗑️ All users deleted');
      await this.createDefaultUsers();
    } catch (error) {
      console.error('❌ Error resetting users:', error);
      throw error;
    }
  }
}
