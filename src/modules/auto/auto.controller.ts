import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Type,
  Query,
  Inject,
  UsePipes,
  ValidationPipe,
  UseFilters,
} from "@nestjs/common";
import { paramCase } from "change-case";
import { ServicePort } from "./auto.service";
import { IdType, PaginationDto } from "src/infra/db/repository.port";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ControllerExceptionFilter } from "src/infra/filters/filter-errors";

export abstract class ControlerPort<T> {
  abstract findAll(paginationDto: PaginationDto): Promise<T[]>;
  abstract findOneById(id: IdType): Promise<T>;
  abstract create(createDto: any): Promise<T>;
  abstract update(id: IdType, updateDto: any): Promise<T>;
  abstract delete(id: IdType): Promise<T>;
  abstract softDelete(id: IdType): Promise<void>;
  abstract restore(id: IdType): Promise<void>;
}

export function generateController<T>(
  schema: Type<T>,
  createDto: any,
  updateDto: any,
): any {
  @ApiTags(schema.name)
  @UseFilters(new ControllerExceptionFilter())
  @Controller(paramCase(schema.name))
  class AutoController extends ControlerPort<T> {
    constructor(
      @Inject(`${schema.name}Service`) private readonly service: ServicePort<T>,
    ) {
      super();
    }

    @Get()
    findAll(@Query() paginationDto: PaginationDto): Promise<T[]> {
      return this.service.findAll(paginationDto);
    }

    @Get(":id")
    findOneById(@Param("id") id: IdType): Promise<T> {
      return this.service.findOneById(id);
    }

    @Post()
    @ApiBody({ type: createDto })
    @UsePipes(new ValidationPipe({ expectedType: createDto, transform: true }))
    create(@Body() data: T): Promise<T> {
      return this.service.create(data);
    }

    @Put(":id")
    @ApiBody({ type: updateDto })
    @UsePipes(new ValidationPipe({ expectedType: updateDto, transform: true }))
    update(@Param("id") id: IdType, @Body() data: Partial<T>): Promise<T> {
      return this.service.update(id, data);
    }

    @Delete(":id")
    delete(@Param("id") id: IdType): Promise<T> {
      return this.service.delete(id);
    }

    @Put(":id/softdelete")
    softDelete(@Param("id") id: IdType): Promise<void> {
      return this.service.softDelete(id);
    }

    @Put(":id/restore")
    restore(@Param("id") id: IdType): Promise<void> {
      return this.service.restore(id);
    }
  }

  return AutoController;
}
