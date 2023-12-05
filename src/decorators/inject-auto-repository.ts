import { Inject, Type } from "@nestjs/common";

export const buildRepositoryNameFor = <Schema>(schema: Type<Schema>): string =>
  `${schema.name}Adapter`;

export const InjectAutoRepository = <Schema>(schema: Type<Schema>) =>
  Inject(buildRepositoryNameFor(schema));
