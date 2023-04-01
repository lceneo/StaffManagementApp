import {inject} from "@angular/core";
import {Router, RouterStateSnapshot} from "@angular/router";
import {IAuthServiceToken} from "../interfaces/IAuthService";

export const authGuard = (router: Router, activatedRoute: RouterStateSnapshot) => {
  const path = activatedRoute.url;
  const isAuthorized = inject(IAuthServiceToken).isAuthorized();
  switch (path){
    case "/login":
    case "/registration":
      if(isAuthorized){
        inject(Router).navigate(["users"]);
        return false;
      }
      return true;
    default:
      if(!isAuthorized) {
        inject(Router).navigate(["login"]);
        return false;
      }
      return true;
  }
}

