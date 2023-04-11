import {inject, Injectable, InjectionToken} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {IUser} from "../models/IUser";
import {IUserDbService, IUserDbServiceToken} from "../interfaces/IUserDbService";
import {map, Observable} from "rxjs";

export const UsersToken = new InjectionToken<Observable<IUser[]>>("Error while fetching users");

export const fbDataTransformationFn = () => {
  const fbDbService = inject(IUserDbServiceToken);
  fbDbService.setCollectionPath("Users");
  return fbDbService.getAllUsers$()
    .pipe(map(res => {
      return res.map(e => {
        const data = e.payload.doc.data()
        data.id = e.payload.doc.id;
        return data;
      });
    }))
};

@Injectable()
export class FbDbService implements IUserDbService{

  public usersCollectionPath?: string;

  constructor(private afs: AngularFirestore) { }

  public addUser(user: IUser){
    if(!this.usersCollectionPath)
      throw new Error();
    user.id = this.afs.createId();
    return this.afs.collection<IUser>(`/${this.usersCollectionPath}`).add(user);
  }

  public getAllUsers$(){
    if(!this.usersCollectionPath)
      throw new Error();
    return this.afs.collection<IUser>(`/${this.usersCollectionPath}`).snapshotChanges();
  }

  public deleteStudent(user: IUser){
    if(!this.usersCollectionPath)
      throw new Error();
    return this.afs.doc(`/${this.usersCollectionPath}/${user.id}`).delete();
  }

  public setCollectionPath(path: string){
    this.usersCollectionPath = path;
  }

  public async updateUser(user: IUser){
    await this.deleteStudent(user);
    await this.addUser(user);
  }
}
