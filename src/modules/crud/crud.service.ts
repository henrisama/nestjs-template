import * as bcrypt from "bcrypt";
import { Injectable, Type } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { saltOrRounds } from "src/conf/api.conf";

export abstract class ICrudService<T> {
  abstract findAll(): Promise<T[]>;
  abstract findOneById(id: string): Promise<T>;
  abstract create(createDto: any): Promise<T>;
  abstract update(id: string, updateDto: any): Promise<T>;
  abstract delete(id: string): Promise<DeleteResult>;
  abstract softDelete(id: string): Promise<UpdateResult>;
}

export function generateService<T>(entity: Type<T>): any {
  @Injectable()
  class CrudService extends ICrudService<T> {
    constructor(
      @InjectRepository(entity) private readonly repository: Repository<T>,
    ) {
      super();
    }

    async findAll(): Promise<T[]> {
      return this.repository.find();
    }

    async findOneById(id: string): Promise<T> {
      return await this.repository.findOneBy(<any>{ id });
    }

    async create(createDto: any): Promise<T> {
      return this.repository.save(new entity(createDto));
    }

    async update(id: string, updateDto: any): Promise<T> {
      const entity = await this.findOneById(id);

      if (updateDto.password) {
        updateDto.password = await bcrypt.hash(
          updateDto.password,
          saltOrRounds,
        );
      }

      return this.repository.save({ ...entity, ...updateDto });
    }

    async delete(id: string): Promise<DeleteResult> {
      return await this.repository.delete(id);
    }

    async softDelete(id: string): Promise<UpdateResult> {
      return await this.repository.softDelete(id);
    }
  }

  return CrudService;
}
