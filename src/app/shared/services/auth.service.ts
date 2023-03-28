import { Injectable } from '@angular/core';
import {IUser} from "../interfaces/IUser";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fbAuth: AngularFireAuth) { }

  public login(user: IUser): Promise<firebase.auth.UserCredential>{
     return this.fbAuth.signInWithEmailAndPassword(user.email, user.password);
  }

  public register(user: IUser): Promise<firebase.auth.UserCredential>{
   return this.fbAuth.createUserWithEmailAndPassword(user.email, user.password);
  }
}
