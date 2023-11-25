import { ApiProperty } from "@nestjs/swagger";

export type IdType = string;

export class PaginationDto {
  @ApiProperty()
  readonly page?: number;
  @ApiProperty()
  readonly limit?: number;
  @ApiProperty()
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
