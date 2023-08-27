export type IdType = string;

export class PaginationDto {
  readonly page?: number;
  readonly limit?: number;
  readonly search?: string;
}

export abstract class RepositoryPort<T> {
  abstract findAll(paginationDto: PaginationDto): Promise<T[]>;
  abstract findOneById(id: IdType): Promise<T>;
  abstract create(createDto: T): Promise<T>;
  abstract update(id: IdType, updateDto: Partial<T>): Promise<T>;
  abstract delete(id: IdType): Promise<T>;
  abstract softDelete(id: IdType): Promise<void>;
  abstract restore(id: IdType): Promise<void>;
}
