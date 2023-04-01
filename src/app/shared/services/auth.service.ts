import { Injectable } from '@angular/core';
import {IUser} from "../interfaces/IUser";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from 'firebase/compat/app';
import {IAuthService} from "../interfaces/IAuthService";

@Injectable()
export class AuthService implements  IAuthService{

  constructor(private fbAuth: AngularFireAuth) { }

  public login(user: IUser): Promise<firebase.auth.UserCredential>{
     return this.fbAuth.signInWithEmailAndPassword(user.email, user.password);
  }

  public register(user: IUser): Promise<firebase.auth.UserCredential>{
   return this.fbAuth.createUserWithEmailAndPassword(user.email, user.password);
  }

  public saveSessionInfo(sessionInfo: firebase.auth.UserCredential){
    localStorage.setItem("session", JSON.stringify(sessionInfo));
  }

  public isAuthorized(){
    return localStorage.getItem("session") !== null;
  }
}
