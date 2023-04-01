import {inject} from "@angular/core";
import {Router} from "@angular/router";
import {IAuthServiceToken} from "../interfaces/IAuthService";

export const authGuard = () => {
  if(!inject(IAuthServiceToken).isAuthorized()){
    inject(Router).navigate(["login"]);
    return false;
  }
  return true;
}
