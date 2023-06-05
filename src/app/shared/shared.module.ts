import {LOCALE_ID, NgModule} from '@angular/core';
import {FocusDirective} from "./directives/focus.directive";
import {IAuthServiceToken} from "./interfaces/IAuthService";
import {FbAuthService} from "./services/fb-auth.service";
import {LetDirective} from "./directives/ngLet.directive";
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {AsyncPipe, NgIf, registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {ErrorHandlerModule} from "../error-handler/error-handler.module";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    FocusDirective,
    LetDirective,
    NotFoundComponent
  ],
  imports: [ErrorHandlerModule, MatButtonModule, MatProgressSpinnerModule, NgIf, AsyncPipe],
  exports: [
    FocusDirective,
    LetDirective,
    ErrorHandlerModule,
    NotFoundComponent
  ],
  providers: [
    {
      provide: IAuthServiceToken,
      useClass: FbAuthService
    },
    {
      provide: LOCALE_ID,
      useValue: 'fr-Fr'
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-GB'},
  ]
})
export class SharedModule { }
