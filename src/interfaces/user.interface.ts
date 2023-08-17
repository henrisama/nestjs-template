export interface IName {
  first: string;
  last: string;
}

export interface IUser {
  name: IName;
  email: string;
  password: string;
}
