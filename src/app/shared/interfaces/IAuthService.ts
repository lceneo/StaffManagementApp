import {IAuthCredentials} from "./IAuthCredentials";
import firebase from "firebase/compat";
import {InjectionToken} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

export const IAuthServiceToken = new InjectionToken<IAuthService>("Authorization error");

export interface IAuthService {
  login : (credentials: IAuthCredentials) => Promise<firebase.auth.UserCredential>;
  signOut : () => void;
  register: (credentials: IAuthCredentials) => Promise<firebase.auth.UserCredential>;
  saveSessionInfo: (sessionInfo: firebase.auth.UserCredential) => void;
  isAuthorized: () => boolean;
  isAuthorized$: Observable<boolean>;
}
