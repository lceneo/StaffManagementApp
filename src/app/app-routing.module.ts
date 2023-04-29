import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./authorization/components/login/login.component";
import {RegistrationComponent} from "./authorization/components/registration/registration.component";
import {UsersListComponent} from "./main-content/components/users-list/users-list.component";
import {authGuard} from "./shared/guards/auth.guard";
import {UserInfoComponent} from "./main-content/components/user-info/user-info.component";
import {SearchFiltersComponent} from "./main-content/components/search-filters/search-filters.component";

const routes: Routes = [

  { path: "", redirectTo: "users", pathMatch: "full" },
  { path: "login", component: LoginComponent, canActivate: [authGuard] },
  { path: "registration", component: RegistrationComponent, canActivate: [authGuard] },
  { path: "users", loadChildren: () => import("./main-content/main-content.module").then(m => m.MainContentModule), canActivate: [authGuard] },
  { path: "users/:id", component: UserInfoComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
