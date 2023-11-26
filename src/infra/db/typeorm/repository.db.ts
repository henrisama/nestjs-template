import { Repository, SelectQueryBuilder } from "typeorm";
import { IdType, PaginationDto, RepositoryPort } from "../repository.port";
import { Injectable, NotFoundException, Type } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

export function generateTypeormRepository<T>(entity: Type<T>): any {
  @Injectable()
  class TypeOrmRepository implements RepositoryPort<T> {
    constructor(
      @InjectRepository(entity) private readonly repository: Repository<T>,
    ) {}

    async findAll(paginationDto: PaginationDto): Promise<T[]> {
      const queryBuilder: SelectQueryBuilder<T> =
        this.repository.createQueryBuilder(entity.name);

      // TODO
      /* if (paginationDto.search) {
        queryBuilder.where(`${entity.name} LIKE :search`, {
          search: `%${paginationDto.search}%`,
        });
      } */

      if (paginationDto.page && paginationDto.limit) {
        queryBuilder.skip((paginationDto.page - 1) * paginationDto.limit);
        queryBuilder.take(paginationDto.limit);
      }

      return queryBuilder.getMany();
    }

    async findOneById(id: IdType): Promise<T> {
      const entity = await this.repository.findOneBy(<any>{ id });

      if (!entity) {
        throw new NotFoundException(`Record with ID ${id} not found`);
      }

      return entity;
    }

    async create(createDto: T): Promise<T> {
      return await this.repository.save(new entity(createDto));
    }

    async update(id: IdType, updateDto: Partial<T>): Promise<T> {
      const entity = await this.findOneById(id);
      return await this.repository.save({ ...entity, ...updateDto });
    }

    async delete(id: IdType): Promise<T> {
      const entity = await this.findOneById(id);
      return await this.repository.remove(entity);
    }

    async softDelete(id: IdType): Promise<void> {
      await this.findOneById(id);
      await this.repository.softDelete(id);
    }

    async restore(id: IdType): Promise<void> {
      await this.repository.update(id, <any>{ deletedAt: null });
    }
  }

  return TypeOrmRepository;
}
