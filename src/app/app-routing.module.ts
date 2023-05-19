import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./authorization/components/login/login.component";
import {RegistrationComponent} from "./authorization/components/registration/registration.component";
import {authGuard} from "./shared/guards/auth.guard";
import {NotFoundComponent} from "./shared/components/not-found/not-found.component";

const routes: Routes = [

  { path: "", redirectTo: "users", pathMatch: "full" },
  { path: "login", component: LoginComponent, canActivate: [authGuard] },
  { path: "registration", component: RegistrationComponent, canActivate: [authGuard] },
  { path: "users", loadChildren: () => import("./main-content/main-content.module").then(m => m.MainContentModule), canActivate: [authGuard] },
  { path: "unknown-page", component: NotFoundComponent},
  { path: "**", redirectTo: "unknown-page"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
