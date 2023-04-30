import {inject, Injectable, InjectionToken} from '@angular/core';
import {AngularFirestore, CollectionReference, Query} from "@angular/fire/compat/firestore";
import {IUser, IUserFb, Promotion} from "../models/IUser";
import {IUserDbService, IUserDbServiceToken} from "../interfaces/IUserDbService";
import {map, Observable} from "rxjs";

export const UsersToken = new InjectionToken<Observable<IUser[]>>("Error while fetching users");


export const fbDataTransformationFn = () => {
  const fbDbService = inject(IUserDbServiceToken);
  return fbDbService.getAllUsers$()
    .pipe(map(res => {
      return res.map(e => {
        const data = e.payload.doc.data();
        const [birthdayDate, interviewDate, firstWorkDayDate] =
          [data.birthdayDate.toDate(), data.interviewDate.toDate(),  data.firstWorkDayDate.toDate()]
        const salaryHistory = data.salaryHistory.map(salaryItem => ({date: salaryItem.date.toDate(), salary: salaryItem.salary}));
        let user = {...data, birthdayDate: birthdayDate, interviewDate: interviewDate, firstWorkDayDate: firstWorkDayDate, salaryHistory: salaryHistory};
        const recentPromotionDate = user.salaryHistory[0].date.getTime();
        const currentDate = Date.now();
        const intervalBetweenPromotions = Math.floor((currentDate - recentPromotionDate) / (1000 * 3600 * 24));
        if(intervalBetweenPromotions <= 89)
          user.lastPromotion = Promotion.Recent;
        else if(intervalBetweenPromotions > 182)
          user.lastPromotion = Promotion.LongAgo;
        else
          user.lastPromotion = Promotion.Normal;
        return user;
      });
    }));
}

@Injectable()
export class FbDbService implements IUserDbService{

  public usersCollectionPath?: string;
  constructor(private afs: AngularFirestore) { }

  public addUser(user: IUser){
    const newDocRef = this.afs.collection<IUser>('/Users').doc().ref;
    user.id = newDocRef.id;
    return newDocRef.set(user);
  }

  public getAllUsers$(){
    return this.afs.collection<IUserFb>('/Users').snapshotChanges();
  }

  public getUserById$(id: string){
    return this.afs.collection<IUserFb>('/Users', ref => {
      let query : CollectionReference | Query = ref;
      query = query.where('id', '==', id);
      return query;
    }).snapshotChanges();
  }

  public deleteUser(user: IUser){
    return this.afs.doc(`/Users/${user.id}`).delete();
  }

  public updateUser(user: IUser, newData: Partial<IUser>){
     return this.afs.doc(`/Users/${user.id}`).update(newData);
  }
}
