import {IUser} from "./IUser";
import firebase from "firebase/compat";
import {InjectionToken} from "@angular/core";

export const IAuthServiceToken = new InjectionToken<IAuthService>("Authorization error");

export interface IAuthService {

  login : (user: IUser) => Promise<firebase.auth.UserCredential>;
  register: (user: IUser) => Promise<firebase.auth.UserCredential>;
  saveSessionInfo: (sessionInfo: firebase.auth.UserCredential) => void;
  isAuthorized: () => boolean;
}
