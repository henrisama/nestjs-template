import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Type,
  Query,
  Inject,
  UsePipes,
  ValidationPipe,
  UseFilters,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { paramCase } from "change-case";
import { IdType } from "src/conf/db.conf";
import { IAutoService } from "./auto.service";
import { PaginationDto } from "./dtos/pagination.dto";
import { ApiBody, ApiTags, ApiResponse } from "@nestjs/swagger";
import { ControllerExceptionFilter } from "src/infra/filters/filter-errors";
import { IEndpoints } from "src/interfaces/endpoints.interface";
import { OptionalDecorator } from "src/decorators/optional-decorator";

export interface IAutoController<T> {
  findAll(paginationDto: PaginationDto): Promise<T[]>;
  findOneById(id: IdType): Promise<T>;
  create(createDto: any): Promise<T>;
  update(id: IdType, updateDto: any): Promise<T>;
  delete(id: IdType): Promise<T>;
  softDelete(id: IdType): Promise<void>;
  restore(id: IdType): Promise<void>;
}

export function generateController<T>(
  schema: Type<T>,
  createDto: any,
  updateDto: any,
  {
    findAll = true,
    findOneById = true,
    create = true,
    update = true,
    delete: _delete = true,
    softdelete = true,
    restore = true,
  }: IEndpoints,
): any {
  @ApiTags(schema.name)
  @UseFilters(new ControllerExceptionFilter())
  @Controller(paramCase(schema.name))
  class AutoController implements IAutoController<T> {
    constructor(
      @Inject(`${schema.name}Service`)
      private readonly service: IAutoService<T>,
    ) {}

    @OptionalDecorator(Get(), findAll)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
      status: HttpStatus.OK,
      description: "List of all records",
      type: [createDto],
    })
    async findAll(@Query() paginationDto: PaginationDto): Promise<T[]> {
      return await this.service.findAll(paginationDto);
    }

    @OptionalDecorator(Get(":id"), findOneById)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
      status: HttpStatus.OK,
      description: "The record with the given ID",
      type: createDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: "Record not found",
    })
    async findOneById(@Param("id") id: IdType): Promise<T> {
      return await this.service.findOneById(id);
    }

    @OptionalDecorator(Post(), create)
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: createDto })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: "Record created successfully",
      type: createDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: "Bad request",
    })
    @UsePipes(new ValidationPipe({ expectedType: createDto, transform: true }))
    async create(@Body() data: T): Promise<T> {
      return await this.service.create(data);
    }

    @OptionalDecorator(Patch(":id"), update)
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: createDto })
    @ApiResponse({
      status: HttpStatus.OK,
      description: "Record updated successfully",
      type: createDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: "Bad request",
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: "Record not found",
    })
    @UsePipes(new ValidationPipe({ expectedType: updateDto, transform: true }))
    async update(
      @Param("id") id: IdType,
      @Body() data: Partial<T>,
    ): Promise<T> {
      return await this.service.update(id, data);
    }

    @OptionalDecorator(Delete(":id"), _delete)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
      status: HttpStatus.OK,
      description: "Record deleted successfully",
      type: createDto,
    })
    async delete(@Param("id") id: IdType): Promise<T> {
      return await this.service.delete(id);
    }

    @OptionalDecorator(Patch(":id/softdelete"), softdelete)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: "Record soft-deleted successfully",
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: "Record not found",
    })
    async softDelete(@Param("id") id: IdType): Promise<void> {
      return await this.service.softDelete(id);
    }

    @OptionalDecorator(Patch(":id/restore"), restore)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
      status: HttpStatus.OK,
      description: "Record restored successfully",
    })
    async restore(@Param("id") id: IdType): Promise<void> {
      return await this.service.restore(id);
    }
  }

  return AutoController;
}
