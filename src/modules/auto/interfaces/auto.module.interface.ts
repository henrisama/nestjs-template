import { IAutoEndpoints } from "./auto.endpoints.interface";

export interface IAutoModuleOptions {
  schema: any;
  repository?: any;
  service?: any;
  controller?: any;
  createDto?: any;
  updateDto?: any;
  endpoints?: IAutoEndpoints;
}
