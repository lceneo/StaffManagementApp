import {inject, Injectable, InjectionToken} from '@angular/core';
import {AngularFirestore, CollectionReference, Query} from "@angular/fire/compat/firestore";
import {IUser} from "../models/IUser";
import {IUserDbService, IUserDbServiceToken} from "../interfaces/IUserDbService";
import {map, Observable} from "rxjs";

export const UsersToken = new InjectionToken<Observable<IUser[]>>("Error while fetching users");

export const fbDataTransformationFn = () => {
  const fbDbService = inject(IUserDbServiceToken);
  return fbDbService.getAllUsers$()
    .pipe(map(res => res.map(e => e.payload.doc.data())))
}

@Injectable()
export class FbDbService implements IUserDbService{

  public usersCollectionPath?: string;
  constructor(private afs: AngularFirestore) { }

  public addUser(user: IUser){
    user.id = this.afs.createId();
    return this.afs.collection<IUser>('/Users').add(user);
  }

  public getAllUsers$(){
    return this.afs.collection<IUser>('/Users').snapshotChanges();
  }

  public getUserById$(id: string){
    return this.afs.collection<IUser>('/Users', ref => {
      let query : CollectionReference | Query = ref;
      query = query.where('id', '==', id);
      return query;
    }).snapshotChanges();
  }

  public deleteUser(user: IUser){
    return this.afs.doc(`/Users/${user.id}`).delete();
  }

  public async updateUser(user: IUser){
    await this.deleteUser(user);
    await this.addUser(user);
  }
}
