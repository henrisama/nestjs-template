import { Model, model } from "mongoose";
import { IdType } from "src/conf/db.conf";
import { Injectable } from "@nestjs/common";
import { IAutoRepository } from "src/modules/auto/interfaces/auto.repository.interface";

export function generateMongoRepository<T>(): any {
  @Injectable()
  class MongoRepository implements IAutoRepository<T> {
    private model: Model<T>;

    constructor(schema: any, modelName: string) {
      this.model = model(modelName, schema);
    }

    async findAll(take: number, skip: number): Promise<[T[], number]> {
      const entities = await this.model.find().limit(take).skip(skip).exec();
      const count = await this.model.countDocuments().exec();
      return [entities, count];
    }

    async findOneById(id: IdType): Promise<T> {
      return this.model.findById(id).exec();
    }

    findOneByProperty(key: keyof T, value: any): Promise<T> {
      throw new Error("Method not implemented.");
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
