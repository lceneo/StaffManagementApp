import { Injectable } from '@angular/core';
import {IUserFilters} from "../../shared/models/IUser";

export interface IListState {
  page: number;
  filters: IUserFilters;
}

@Injectable()
export class ListStateSaveService {

  private savedState?: IListState;

  constructor() {}

  public getState(): IListState | undefined{
    return this.savedState ? {...this.savedState} : undefined;
  }

  public setState(state: IListState){
    this.savedState = state;
  }

  public resetState(){
    this.savedState = undefined;
  }
}
