// crud.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Type,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ICrudService } from "./crud.service";
import { DeleteResult, UpdateResult } from "typeorm";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ControllerExceptionFilter } from "src/filters/filter-errors";

export function generateController<T>(
  entity: Type<T>,
  entityServiceName: string,
  createDto: any,
  updateDto: any,
): any {
  const name = entity.name.toLowerCase();

  @ApiTags(entity.name)
  @UseFilters(new ControllerExceptionFilter())
  @Controller(name)
  class CrudController {
    constructor(
      @Inject(entityServiceName) private readonly service: ICrudService<T>,
    ) {}

    @Get()
    findAll(): Promise<T[]> {
      return this.service.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string): Promise<T> {
      return this.service.findOneById(id);
    }

    @Post()
    @ApiBody({ type: createDto })
    @UsePipes(new ValidationPipe({ expectedType: createDto, transform: true }))
    create(@Body() createDto: any): Promise<T> {
      return this.service.create(createDto);
    }

    @Put(":id")
    @ApiBody({ type: updateDto })
    @UsePipes(new ValidationPipe({ expectedType: updateDto, transform: true }))
    update(@Param("id") id: string, @Body() updateDto: any): Promise<T> {
      return this.service.update(id, updateDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string): Promise<DeleteResult | UpdateResult> {
      return this.service.delete(id);
    }
  }

  return CrudController;
}
