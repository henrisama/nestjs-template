import { Inject, Injectable, Type } from "@nestjs/common";
import {
  IdType,
  PaginationDto,
  RepositoryPort,
} from "src/infra/db/repository.port";

export abstract class ServicePort<T> {
  abstract findAll(paginationDto: PaginationDto): Promise<T[]>;
  abstract findOneById(id: IdType): Promise<T>;
  abstract create(createDto: any): Promise<T>;
  abstract update(id: IdType, updateDto: any): Promise<T>;
  abstract delete(id: IdType): Promise<T>;
  abstract softDelete(id: IdType): Promise<void>;
  abstract restore(id: IdType): Promise<void>;
}

export function generateService<T>(schema: Type<T>): any {
  @Injectable()
  class AutoService implements ServicePort<T> {
    constructor(
      @Inject(`${schema.name}Adapter`)
      private readonly repository: RepositoryPort<T>,
    ) {}

    async findAll(paginationDto: PaginationDto): Promise<T[]> {
      return await this.repository.findAll(paginationDto);
    }

    async findOneById(id: IdType): Promise<T> {
      return await this.repository.findOneById(id);
    }

    async create(data: T): Promise<T> {
      return await this.repository.create(data);
    }

    async update(id: IdType, data: Partial<T>): Promise<T> {
      return await this.repository.update(id, data);
    }

    async delete(id: IdType): Promise<T> {
      return await this.repository.delete(id);
    }

    async softDelete(id: IdType): Promise<void> {
      await this.repository.softDelete(id);
    }

    async restore(id: IdType): Promise<void> {
      await this.repository.restore(id);
    }
  }

  return AutoService;
}
