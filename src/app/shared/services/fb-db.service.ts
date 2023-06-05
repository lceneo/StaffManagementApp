import {inject, Injectable, InjectionToken} from '@angular/core';
import {AngularFirestore, CollectionReference, Query} from "@angular/fire/compat/firestore";
import {IUser, IUserFb, Promotion} from "../models/IUser";
import {IUserDbService, IUserDbServiceToken} from "../interfaces/IUserDbService";
import {map, Observable, startWith} from "rxjs";
import firebase from "firebase/compat/app";
// import "firebase/storage"
import 'firebase/compat/storage'
import {IProject} from "../models/IProject";

export const UsersToken = new InjectionToken<Observable<IUser[]>>("Error while fetching users");
export const ProjectsToken = new InjectionToken<Observable<IProject[]>>("Error while fetching projects");


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
        const recentPromotion = user.salaryHistory[0];
        const recentPromotionDate = recentPromotion.date.getTime();
        const currentDate = Date.now();
        const intervalBetweenPromotionAndCurrentDate = Math.floor((currentDate - recentPromotionDate) / (1000 * 3600 * 24));
        if(intervalBetweenPromotionAndCurrentDate <= 89 && user.salaryHistory.length > 1)
            user.lastPromotion = Number(recentPromotion.salary) > Number(user.salaryHistory[1].salary) ? Promotion.Successful : Promotion.Unsuccessful;
        else if(intervalBetweenPromotionAndCurrentDate > 182)
          user.lastPromotion = Promotion.Unsuccessful;
        else
          user.lastPromotion = Promotion.Normal;
        return user;
      });
    }));
}

export const fbProjectsDataTransformationFn = () => {
  const fbDbService = inject(FbDbService);
  return fbDbService.getAllProjects$()
    .pipe(
      map(res => res.map(e => e.payload.doc.data())),
      startWith([])
      );
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

  public uploadUserImg(user: IUser, img: File){
    const imgRef = firebase.storage().ref(`images${user.id}`);
    return imgRef.put(img);
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

  public addProject(project: IProject){
    const newDocRef = this.afs.collection<IProject>('/Projects').doc().ref;
    project.id = newDocRef.id;
    return newDocRef.set(project);
  }

  public getAllProjects$(){
    return this.afs.collection<IProject>('/Projects').snapshotChanges();
  }

  getProjectById$(id: string){
    return this.afs.collection<IProject>('/Projects', ref => {
      let query : CollectionReference | Query = ref;
      query = query.where('id', '==', id);
      return query;
    }).snapshotChanges();
  }

  public deleteProject(id: string){
    return this.afs.doc(`/Projects/${id}`).delete();
  }

  public updateProject(projectId: string | undefined, newData: Partial<IProject>){
    return this.afs.doc(`/Projects/${projectId}`).update(newData);
  }
}
