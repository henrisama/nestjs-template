import { Injectable, Type } from "@nestjs/common";
import { IdType } from "src/conf/db.conf";
import { InjectAutoRepository } from "src/decorators/inject-auto-repository";
import { IRepository } from "src/infra/db/repository.interface";
import { PaginationDto } from "./dtos/pagination.dto";

export interface IAutoService<T> {
  findAll(paginationDto: PaginationDto): Promise<T[]>;
  findOneById(id: IdType): Promise<T>;
  create(createDto: any): Promise<T>;
  update(id: IdType, updateDto: any): Promise<T>;
  delete(id: IdType): Promise<T>;
  softDelete(id: IdType): Promise<void>;
  restore(id: IdType): Promise<void>;
}

export function generateService<T>(schema: Type<T>): any {
  @Injectable()
  class AutoService implements IAutoService<T> {
    constructor(
      @InjectAutoRepository(schema)
      private readonly repository: IRepository<T>,
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
