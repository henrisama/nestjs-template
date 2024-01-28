import { IdType } from "src/conf/db.conf";
import { Injectable, Type } from "@nestjs/common";
import { IAutoService } from "./interfaces/auto.service.interface";
import { IAutoRepository } from "./interfaces/auto.repository.interface";
import { InjectAutoRepository } from "src/decorators/inject-auto-repository";

export function generateService<T>(schema: Type<T>): any {
  @Injectable()
  class AutoService implements IAutoService<T> {
    constructor(
      @InjectAutoRepository(schema)
      private readonly repository: IAutoRepository<T>,
    ) {}

    async findAll(take: number, skip: number): Promise<[T[], number]> {
      return await this.repository.findAll(take, skip);
    }

    async findOneById(id: IdType): Promise<T> {
      return await this.repository.findOneById(id);
    }

    async findOneByProperty(key: keyof T, value: any): Promise<T> {
      return await this.repository.findOneByProperty(key, value);
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
