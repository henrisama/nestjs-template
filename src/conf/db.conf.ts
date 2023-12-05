export enum DatabaseAdapterEnum {
  TYPEORM = "typeorm",
  MONGO = "mongo",
}

export const DatabaseAdapter = process.env.DATABASE_ADAPTER;

export type IdType = string;
