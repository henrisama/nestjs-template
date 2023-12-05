import { TypeOrmModule } from "@nestjs/typeorm";
import { generateService } from "./auto.service";
import { MongooseModule } from "@nestjs/mongoose";
import { generateController } from "./auto.controller";
import { DatabaseAdapter, DatabaseAdapterEnum } from "src/conf/db.conf";
import { buildServiceNameFor } from "src/decorators/inject-auto-service";
import { generateMongoRepository } from "src/infra/db/mongo/repository.db";
import { buildRepositoryNameFor } from "src/decorators/inject-auto-repository";
import { generateTypeormRepository } from "src/infra/db/typeorm/repository.db";
import { IEndpoints } from "src/interfaces/endpoints.interface";

export interface IAutoModuleOptions {
  // Specify the schema for the module. This could be a TypeORM entity or a Mongoose schema.
  schema: any;

  // Optional custom repository.
  repository?: any;

  // Optional custom service.
  service?: any;

  // Optional custom controller.
  controller?: any;

  // DTOs for creating and updating entities.
  createDto?: any;
  updateDto?: any;

  // Custom endpoints
  endpoints?: IEndpoints;
}

export class AutoModule {
  static forFeature<T>(options: IAutoModuleOptions): any {
    const providers = this.buildProviders<T>(options);

    return {
      imports: [
        DatabaseAdapter === DatabaseAdapterEnum.TYPEORM
          ? TypeOrmModule.forFeature([options.schema])
          : MongooseModule.forFeature([
              {
                name: options.schema.name,
                schema: options.schema,
              },
            ]),
      ],
      providers: [...providers],
      exports: [...providers],
      controllers: [this.buildController<T>(options)],
    };
  }

  private static buildRepository<T>(options: IAutoModuleOptions) {
    return options.repository ?? DatabaseAdapter === DatabaseAdapterEnum.TYPEORM
      ? generateTypeormRepository<T>(options.schema)
      : generateMongoRepository<T>();
  }

  private static buildService<T>(options: IAutoModuleOptions) {
    return options.service ?? generateService<T>(options.schema);
  }

  private static buildController<T>(options: IAutoModuleOptions) {
    return (
      options.controller ??
      generateController<T>(
        options.schema,
        options.createDto,
        options.updateDto,
        options.endpoints ?? {},
      )
    );
  }

  private static buildProviders<T>(options: IAutoModuleOptions) {
    return [
      {
        provide: buildRepositoryNameFor<T>(options.schema),
        useClass: this.buildRepository(options),
      },
      {
        provide: buildServiceNameFor<T>(options.schema),
        useClass: this.buildService(options),
      },
    ];
  }
}
