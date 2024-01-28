import { Repository } from "typeorm";
import { IdType } from "src/conf/db.conf";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException, Type } from "@nestjs/common";
import { IAutoRepository } from "./interfaces/auto.repository.interface";

export function generateTypeormRepository<T>(entity: Type<T>): any {
  @Injectable()
  class TypeOrmRepository implements IAutoRepository<T> {
    constructor(
      @InjectRepository(entity) private readonly repository: Repository<T>,
    ) {}

    async findAll(take: number, skip: number): Promise<[T[], number]> {
      return await this.repository.findAndCount({ take, skip });
    }

    async findOneById(id: IdType): Promise<T> {
      const item = await this.repository.findOneBy(<any>{ id });
      if (!item) {
        throw new NotFoundException(`Record with ID ${id} not found`);
      }
      return item;
    }

    async findOneByProperty(key: keyof T, value: any): Promise<T> {
      const item = await this.repository.findOneBy(<any>{ [key]: value });

      if (!item) {
        throw new NotFoundException(
          `Record with ${key.toString()} = ${value} not found`,
        );
      }
      return item;
    }

    async create(model: T): Promise<T> {
      return await this.repository.save(new entity(model));
    }

    async update(id: IdType, model: Partial<T>): Promise<T> {
      const item = await this.findOneById(id);
      return await this.repository.save({ ...item, ...model });
    }

    async delete(id: IdType): Promise<T> {
      const item = await this.findOneById(id);
      return await this.repository.remove(item);
    }

    async softDelete(id: IdType): Promise<void> {
      await this.repository.softDelete(id);
    }

    async restore(id: IdType): Promise<void> {
      await this.repository.update(id, <any>{ deletedAt: null });
    }
  }

  return TypeOrmRepository;
}
