import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from "./components/login/login.component";
import {RegistrationComponent} from "./components/registration/registration.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {ErrorHandlerModule} from "../error-handler/error-handler.module";
import {FocusDirective} from "../shared/directives/focus.directive";
import {AppModule} from "../app.module";


@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    FocusDirective
  ],
  imports: [
    ErrorHandlerModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  exports:[
    LoginComponent,
    RegistrationComponent
  ]
})
export class AuthorizationModule { }
