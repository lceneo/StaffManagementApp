import {InjectionToken} from "@angular/core";
import {IUser} from "../models/IUser";
import {DocumentChangeAction, DocumentReference} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";

export const IUserDbServiceToken = new InjectionToken<IUserDbService>("UserDb error");

export interface IUserDbService{
  addUser: (user: IUser) => Promise<void>;
  getAllUsers$: () => Observable<DocumentChangeAction<IUser>[]>;
  getUserById$: (id: string) => Observable<DocumentChangeAction<IUser>[]>;
  deleteUser: (user: IUser) => Promise<void>;
  updateUser: (user: IUser, newData: Partial<IUser>) => Promise<void>;
}
