import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./authorization/components/login/login.component";
import {RegistrationComponent} from "./authorization/components/registration/registration.component";
import {UsersListComponent} from "./main/components/users-list/users-list.component";

const routes: Routes = [

  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "registration", component: RegistrationComponent },
  { path: "users", component: UsersListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
