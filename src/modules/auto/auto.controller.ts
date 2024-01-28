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
  UsePipes,
  ValidationPipe,
  UseFilters,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import {
  ApiBody,
  ApiTags,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { paramCase } from "change-case";
import { IdType } from "src/conf/db.conf";
import { IAutoService } from "./interfaces/auto.service.interface";
import { OptionalDecorator } from "src/decorators/optional-decorator";
import { InjectAutoService } from "src/decorators/inject-auto-service";
import { IAutoEndpoints } from "./interfaces/auto.endpoints.interface";
import { IAutoController } from "./interfaces/auto.controller.interface";
import { ControllerExceptionFilter } from "src/infra/filters/filter-errors";

export function generateController<T>(
  schema: Type<T>,
  createDto: any,
  updateDto: any,
  {
    findAll = true,
    findOneById = true,
    findOneByProperty = true,
    create = true,
    update = true,
    delete: _delete = true,
    softdelete = true,
    restore = true,
  }: IAutoEndpoints,
): any {
  @ApiTags(schema.name)
  @Controller(paramCase(schema.name))
  @UseFilters(new ControllerExceptionFilter())
  class AutoController implements IAutoController<T> {
    constructor(
      @InjectAutoService(schema)
      private readonly service: IAutoService<T>,
    ) {}

    @OptionalDecorator(Get(), findAll)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
      status: HttpStatus.OK,
      description: "List of all records",
      type: [createDto],
    })
    @ApiQuery({ name: "take", type: Number, required: false })
    @ApiQuery({ name: "skip", type: Number, required: false })
    async findAll(
      @Query("take") take: number,
      @Query("skip") skip: number,
    ): Promise<[T[], number]> {
      take = Number(take || 10);
      skip = Number(skip || 0);
      return await this.service.findAll(take, skip);
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

    @OptionalDecorator(Get(":key/:value"), findOneByProperty)
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
    @ApiParam({ name: "key", type: String, required: true })
    @ApiParam({ name: "value", type: String, required: true })
    async findOneByProperty(
      @Param("key") key: keyof T,
      @Param("value") value: any,
    ): Promise<T> {
      console.log(key, value);
      return this.service.findOneByProperty(key, value);
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
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: "Record not found",
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
