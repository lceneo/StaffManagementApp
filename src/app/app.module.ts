import { inject, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from "./enviroments/environment";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthorizationModule } from "./authorization/authorization.module";
import { FbAuthService } from "./shared/services/fb-auth.service";
import { IAuthServiceToken } from "./shared/interfaces/IAuthService";
import { MainContentModule } from "./main-content/main-content.module";
import { ErrorHandlerModule } from "./error-handler/error-handler.module";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { FocusDirective } from "./shared/directives/focus.directive";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';


import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AuthorizationModule,
    MatSelectModule,
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
    MatInputModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }, useDefaultLang: false
    })

  ],
  providers: [],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  isChecked: boolean = false;
  mode: string = '';

  changed(event: MatSlideToggleChange): void {
    document.body.classList.toggle('darkMode');
  }
}

export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, '../assets/locale/', '.json');
}
