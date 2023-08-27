import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MongooseModule } from "@nestjs/mongoose";
import { generateService } from "./auto.service";
import { generateController } from "./auto.controller";
import { generateTypeormRepository } from "src/infra/db/typeorm/repository.db";
import { generateMongoRepository } from "src/infra/db/mongo/repository.db";

export enum DatabaseAdapter {
  TYPEORM = "typeorm",
  MONGO = "mongo",
}

interface EntityModuleOptions {
  schema: any;
  adapter: DatabaseAdapter;
  createDto?: any;
  updateDto?: any;
}

export class EntityModule {
  static forFeature<T>(options: EntityModuleOptions): any {
    const repositoryGen =
      options.adapter === DatabaseAdapter.TYPEORM
        ? generateTypeormRepository<T>(options.schema)
        : generateMongoRepository<T>();

    const serviceGen = generateService<T>(options.schema);
    const controllerGen = generateController<T>(
      options.schema,
      options.createDto,
      options.updateDto,
    );

    @Module({
      imports: [
        options.adapter === DatabaseAdapter.TYPEORM
          ? TypeOrmModule.forFeature([options.schema])
          : MongooseModule.forFeature([
              {
                name: options.schema.name,
                schema: options.schema,
              },
            ]),
      ],
      providers: [
        {
          provide: `${options.schema.name}Adapter`,
          useClass: repositoryGen,
        },
        {
          provide: `${options.schema.name}Service`,
          useClass: serviceGen,
        },
      ],
      controllers: [controllerGen],
    })
    class AutoModule {}

    return AutoModule;
  }
}