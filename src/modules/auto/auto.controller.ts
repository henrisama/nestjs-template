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
): any {
  @ApiTags(schema.name)
  @UseFilters(new ControllerExceptionFilter())
  @Controller(paramCase(schema.name))
  class AutoController implements IAutoController<T> {
    constructor(
      @Inject(`${schema.name}Service`)
      private readonly service: IAutoService<T>,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
      status: HttpStatus.OK,
      description: "List of all records",
      type: [createDto],
    })
    findAll(@Query() paginationDto: PaginationDto): Promise<T[]> {
      console.log("teste");
      return this.service.findAll(paginationDto);
    }

    @Get(":id")
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

    @Post()
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
    create(@Body() data: T): Promise<T> {
      return this.service.create(data);
    }

    @Patch(":id")
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
    update(@Param("id") id: IdType, @Body() data: Partial<T>): Promise<T> {
      return this.service.update(id, data);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
      status: HttpStatus.OK,
      description: "Record deleted successfully",
      type: createDto,
    })
    delete(@Param("id") id: IdType): Promise<T> {
      return this.service.delete(id);
    }

    @Patch(":id/softdelete")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: "Record soft-deleted successfully",
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: "Record not found",
    })
    softDelete(@Param("id") id: IdType): Promise<void> {
      return this.service.softDelete(id);
    }

    @Patch(":id/restore")
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
      status: HttpStatus.OK,
      description: "Record restored successfully",
    })
    restore(@Param("id") id: IdType): Promise<void> {
      return this.service.restore(id);
    }
  }

  return AutoController;
}
