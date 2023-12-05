import { Inject, Type } from "@nestjs/common";

export const buildServiceNameFor = <Schema>(schema: Type<Schema>): string =>
  `${schema.name}Service`;

export const InjectAutoService = <Schema>(schema: Type<Schema>) =>
  Inject(buildServiceNameFor(schema));
