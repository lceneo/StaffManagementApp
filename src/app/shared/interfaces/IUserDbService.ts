import {InjectionToken} from "@angular/core";
import {IUser, IUserFb} from "../models/IUser";
import {DocumentChangeAction} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import 'firebase/compat/storage'
import firebase from "firebase/compat/app";


export const IUserDbServiceToken = new InjectionToken<IUserDbService>("UserDb error");

export interface IUserDbService{
  addUser: (user: IUser) => Promise<void>;
  getAllUsers$: () => Observable<DocumentChangeAction<IUserFb>[]>;
  getUserById$: (id: string) => Observable<DocumentChangeAction<IUserFb>[]>;
  deleteUser: (user: IUser) => Promise<void>;
  updateUser: (user: IUser, newData: Partial<IUser>) => Promise<void>;
  uploadUserImg:(user: IUser, img: File) =>  firebase.storage.UploadTask;
}
