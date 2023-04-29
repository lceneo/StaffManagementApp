import { Injectable } from '@angular/core';
import {IAuthCredentials} from "../interfaces/IAuthCredentials";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from 'firebase/compat/app';
import {IAuthService} from "../interfaces/IAuthService";

@Injectable()
export class FbAuthService implements  IAuthService{

  constructor(private fbAuth: AngularFireAuth) { }

  public login(credentials: IAuthCredentials): Promise<firebase.auth.UserCredential>{
    return this.fbAuth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  public register(credentials: IAuthCredentials): Promise<firebase.auth.UserCredential>{
   return this.fbAuth.createUserWithEmailAndPassword(credentials.email, credentials.password);
  }

  public saveSessionInfo(sessionInfo: firebase.auth.UserCredential){
    localStorage.setItem("session", JSON.stringify(sessionInfo));
  }

  public isAuthorized(){
    return localStorage.getItem("session") !== null;
  }
}
