import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from  '@angular/fire/compat'
import { HttpClientModule } from "@angular/common/http";
import { environment } from "./enviroments/environment";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FocusDirective } from './authorization/directives/focus.directive';
import {AuthorizationModule} from "./authorization/authorization.module";
import {AuthService} from "./shared/services/auth.service";
import {IAuthServiceToken} from "./shared/interfaces/IAuthService";
import {MainContentModule} from "./main-content/main-content.module";
import {ErrorHandlerModule} from "./error-handler/error-handler.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AuthorizationModule,
    MainContentModule,
    ErrorHandlerModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: IAuthServiceToken,
      useClass: AuthService
    }
  ],
  exports: [
    FocusDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
