import * as bcrypt from "bcrypt";
import { Repository, SelectQueryBuilder } from "typeorm";
import { IdType, PaginationDto, RepositoryPort } from "../repository.port";
import { Injectable, Type } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { saltOrRounds } from "src/conf/api.conf";

export function generateTypeormRepository<T>(entity: Type<T>): any {
  @Injectable()
  class TypeOrmRepository implements RepositoryPort<T> {
    constructor(
      @InjectRepository(entity) private readonly repository: Repository<T>,
    ) {}

    async findAll(paginationDto: PaginationDto): Promise<T[]> {
      const queryBuilder: SelectQueryBuilder<T> =
        this.repository.createQueryBuilder(entity.name);

      if (paginationDto.search) {
        queryBuilder.where(`${entity.name} LIKE :search`, {
          search: `%${paginationDto.search}%`,
        });
      }

      if (paginationDto.page && paginationDto.limit) {
        queryBuilder.skip((paginationDto.page - 1) * paginationDto.limit);
        queryBuilder.take(paginationDto.limit);
      }

      return queryBuilder.getMany();
    }

    async findOneById(id: IdType): Promise<T> {
      return await this.repository.findOneBy(<any>{ id });
    }

    async create(createDto: T): Promise<T> {
      (createDto as any).password = await bcrypt.hash(
        (createDto as any).password,
        saltOrRounds,
      );

      return this.repository.save(new entity(createDto));
    }

    async update(id: IdType, updateDto: Partial<T>): Promise<T> {
      const entity = await this.findOneById(id);

      if ((updateDto as any).password) {
        (updateDto as any).password = await bcrypt.hash(
          (updateDto as any).password,
          saltOrRounds,
        );
      }

      return this.repository.save({ ...entity, ...updateDto });
    }

    async delete(id: IdType): Promise<T> {
      const entity = await this.findOneById(id);
      return this.repository.remove(entity);
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
