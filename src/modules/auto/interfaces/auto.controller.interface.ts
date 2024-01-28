import { IdType } from "src/conf/db.conf";

export interface IAutoController<T> {
  findAll(take: number, skip: number): Promise<[T[], number]>;
  findOneById(id: IdType): Promise<T>;
  findOneByProperty(key: keyof T, value: any): Promise<T>;
  create(createDto: T): Promise<T>;
  update(id: IdType, updateDto: Partial<T>): Promise<T>;
  delete(id: IdType): Promise<T>;
  softDelete(id: IdType): Promise<void>;
  restore(id: IdType): Promise<void>;
}
