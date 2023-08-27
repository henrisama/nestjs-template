import { Injectable } from "@nestjs/common";
import { Model, model } from "mongoose";
import { IdType, PaginationDto, RepositoryPort } from "../repository.port";

export function generateMongoRepository<T>(): any {
  @Injectable()
  class MongoRepository implements RepositoryPort<T> {
    private model: Model<T>;

    constructor(schema: any, modelName: string) {
      this.model = model(modelName, schema);
    }

    async findAll(paginationDto: PaginationDto): Promise<T[]> {
      const query = {};

      if (paginationDto.search) {
        query["name"] = new RegExp(paginationDto.search, "i");
      }

      return this.model
        .find(query)
        .skip((paginationDto.page - 1) * paginationDto.limit)
        .limit(paginationDto.limit)
        .exec();
    }

    async findOneById(id: IdType): Promise<T> {
      return this.model.findById(id).exec();
    }

    async create(createDto: T): Promise<T> {
      const entity = new this.model(createDto);
      return (await entity.save()) as T;
    }

    async update(id: IdType, updateDto: Partial<T>): Promise<T> {
      return await this.model
        .findByIdAndUpdate(id, updateDto, { new: true })
        .exec();
    }

    async delete(id: IdType): Promise<T> {
      return await this.model.findByIdAndRemove(id).exec();
    }

    async softDelete(id: IdType): Promise<void> {
      await this.model.findByIdAndUpdate(id, { isDeleted: true }).exec();
    }

    async restore(id: IdType): Promise<void> {
      await this.model.findByIdAndUpdate(id, { isDeleted: false }).exec();
    }
  }
  return MongoRepository;
}
