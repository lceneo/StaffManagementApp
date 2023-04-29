import {LOCALE_ID, NgModule} from '@angular/core';
import {FocusDirective} from "./directives/focus.directive";
import {IAuthServiceToken} from "./interfaces/IAuthService";
import {FbAuthService} from "./services/fb-auth.service";
import {LetDirective} from "./directives/ngLet.directive";
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/fr";

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    FocusDirective,
    LetDirective
  ],
  imports: [],
  exports: [
    FocusDirective,
    LetDirective
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
      useValue: 'en-GB'}
  ]
})
export class SharedModule { }
