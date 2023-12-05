export enum DatabaseAdapterEnum {
  TYPEORM = "typeorm",
  MONGO = "mongo",
}

export const DatabaseAdapter: string = DatabaseAdapterEnum.TYPEORM;

export type IdType = string; // or number
