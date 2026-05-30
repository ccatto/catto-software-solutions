// apps/backend/src/common/services/base.service.ts
import { PrismaService } from '../../prisma/prisma.service';
import { BaseEntity } from '../interfaces/base-entity.interface';

export abstract class BaseService<
  T extends BaseEntity,
  CreateInput,
  UpdateInput,
  WhereInput,
> {
  protected abstract readonly prisma: PrismaService;
  protected abstract readonly modelName: string;

  async create(data: CreateInput): Promise<T> {
    return this.prisma[this.modelName].create({
      data,
    }) as unknown as T;
  }

  async findAll(where?: WhereInput): Promise<T[]> {
    return this.prisma[this.modelName].findMany({
      where,
    }) as unknown as T[];
  }

  async findOne(id: string | number): Promise<T | null> {
    return this.prisma[this.modelName].findUnique({
      where: { id },
    }) as unknown as T;
  }

  async update(id: string | number, data: UpdateInput): Promise<T> {
    return this.prisma[this.modelName].update({
      where: { id },
      data,
    }) as unknown as T;
  }

  async remove(id: string | number): Promise<T> {
    return this.prisma[this.modelName].delete({
      where: { id },
    }) as unknown as T;
  }
}
