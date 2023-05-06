import {inject, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from  '@angular/fire/compat'
import { HttpClientModule } from "@angular/common/http";
import { environment } from "./enviroments/environment";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AuthorizationModule} from "./authorization/authorization.module";
import {FbAuthService} from "./shared/services/fb-auth.service";
import {IAuthServiceToken} from "./shared/interfaces/IAuthService";
import {MainContentModule} from "./main-content/main-content.module";
import {ErrorHandlerModule} from "./error-handler/error-handler.module";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {FocusDirective} from "./shared/directives/focus.directive";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {FormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AuthorizationModule,
    ErrorHandlerModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    HttpClientModule,
    MainContentModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatCardModule,
    FormsModule,
    MatIconModule
  ],
  providers: [],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  isChecked: boolean = false;
  mode: string = '';

  changed(event: MatSlideToggleChange): void{
    document.body.classList.toggle('darkMode');
  }
 }
