import {InjectionToken} from "@angular/core";
import {IUser} from "../models/IUser";
import {DocumentChangeAction, DocumentReference} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";

export const IUserDbServiceToken = new InjectionToken<IUserDbService>("UserDb error");

export interface IUserDbService{
  addUser: (user: IUser) => Promise<DocumentReference<IUser>>;
  getAllUsers$: () => Observable<DocumentChangeAction<IUser>[]>;
  deleteStudent: (user: IUser) => Promise<void>;
  setCollectionPath: (path: string) => void;
  updateUser: (user: IUser) => Promise<void>;
}
