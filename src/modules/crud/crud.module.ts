// crud.module.ts
import { Module, Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { generateService } from "./crud.service";
import { generateController } from "./crud.controller";

export function generateEntityServiceName<T>(entity: Type<T>): string {
  return `${entity.name}Service`;
}

export function generateModule<T>(
  entity: Type<T>,
  createDto: any,
  updateDto: any,
) {
  const generatedService = generateService<T>(entity);
  const entityServiceName = generateEntityServiceName(entity);
  const generatedController = generateController<T>(
    entity,
    entityServiceName,
    createDto,
    updateDto,
  );

  @Module({
    imports: [TypeOrmModule.forFeature([entity])],
    providers: [
      {
        provide: entityServiceName,
        useClass: generatedService,
      },
      generatedService,
    ],
    controllers: [generatedController],
  })
  class CrudModule {}

  return CrudModule;
}
