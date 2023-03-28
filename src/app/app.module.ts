import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './authorization/components/registration/registration.component';
import { AngularFireModule } from  '@angular/fire/compat'
import { HttpClientModule } from "@angular/common/http";
import { environment } from "./enviroments/environment";
import { LoginComponent } from "./authorization/components/login/login.component";
import { ReactiveFormsModule } from "@angular/forms";
import { UsersListComponent } from './main/components/users-list/users-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { FocusDirective } from './shared/directives/focus.directive';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    UsersListComponent,
    FocusDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
