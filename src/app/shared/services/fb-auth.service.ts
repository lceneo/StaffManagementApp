import { Injectable } from '@angular/core';
import {IAuthCredentials} from "../interfaces/IAuthCredentials";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from 'firebase/compat/app';
import {IAuthService} from "../interfaces/IAuthService";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class FbAuthService implements  IAuthService{

  constructor(private fbAuth: AngularFireAuth) {
    if(this.isAuthorized())
      this._isAuthorized$.next(true);
  }

  private _isAuthorized$ = new BehaviorSubject<boolean>(false);
  public isAuthorized$ = this._isAuthorized$.asObservable();

  public login(credentials: IAuthCredentials): Promise<firebase.auth.UserCredential>{
    return this.fbAuth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  public signOut(){
    localStorage.removeItem("session");
    this._isAuthorized$.next(false);
  }

  public register(credentials: IAuthCredentials): Promise<firebase.auth.UserCredential>{
   return this.fbAuth.createUserWithEmailAndPassword(credentials.email, credentials.password);
  }

  public saveSessionInfo(sessionInfo: firebase.auth.UserCredential){
    localStorage.setItem("session", JSON.stringify(sessionInfo));
    this._isAuthorized$.next(true);
  }

  public isAuthorized(){
    return localStorage.getItem("session") !== null;
  }
}
