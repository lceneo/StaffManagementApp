import {IUser} from "./IUser";

export interface IProject{
  name: string,
  description: string,
  staff: IUser[],
  id?: string
}

export interface IProjectFilters{
  name: string,
  staff: IUser[]
}
