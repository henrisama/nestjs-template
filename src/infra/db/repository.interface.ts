import { IdType } from "src/conf/db.conf";
import { PaginationDto } from "src/modules/auto/dtos/pagination.dto";

export abstract class IRepository<T> {
  abstract findAll(paginationDto: PaginationDto): Promise<T[]>;
  abstract findOneById(id: IdType): Promise<T>;
  abstract create(createDto: T): Promise<T>;
  abstract update(id: IdType, updateDto: Partial<T>): Promise<T>;
  abstract delete(id: IdType): Promise<T>;
  abstract softDelete(id: IdType): Promise<void>;
  abstract restore(id: IdType): Promise<void>;
}
