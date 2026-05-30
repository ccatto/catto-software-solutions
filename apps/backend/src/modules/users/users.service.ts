// apps/backend/src/modules/users/users.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { UserRole } from '@ccatto-app/database';
import { User } from './entities/user.entity';
import { CreateUserInput, UpdateUserInput, WhereUserInput } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(where?: WhereUserInput): Promise<User[]> {
    return this.prisma.client.user.findMany({
      where,
    });
  }

  async findOne(where: WhereUserInput): Promise<User> {
    const user = await this.prisma.client.user.findFirst({
      where,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(data: CreateUserInput): Promise<User> {
    // Check if user with email already exists
    const existingUser = await this.prisma.client.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with email ${data.email} already exists`,
      );
    }

    // Hash password if provided
    let hashedPassword = null;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.client.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: (data.role as UserRole) || UserRole.user,
      },
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const user = await this.prisma.client.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // If updating email, check if it's already taken
    if (data.email && data.email !== user.email) {
      const existingUser = await this.prisma.client.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ConflictException(
          `User with email ${data.email} already exists`,
        );
      }
    }

    // Hash password if it's being updated
    const updateData = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.client.user.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.role !== undefined && {
          role: updateData.role as UserRole,
        }),
      },
    });
  }

  async remove(id: string): Promise<User> {
    const user = await this.prisma.client.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.client.user.delete({
      where: { id },
    });
  }
}
