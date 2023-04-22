import {LOCALE_ID, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsersListComponent} from "./components/users-list/users-list.component";
import {IUserDbServiceToken} from "../shared/interfaces/IUserDbService";
import {fbDataTransformationFn, FbDbService, UsersToken} from "../shared/services/fb-db.service";
import {NgxPaginationModule} from "ngx-pagination";
import {MatInputModule} from "@angular/material/input";
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { AddUserPopUpComponent } from './components/add-user-pop-up/add-user-pop-up.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { UserInfoComponent } from './components/user-info/user-info.component';
import {MatSliderModule} from "@angular/material/slider";
import {MatSelectModule} from "@angular/material/select";
import {LetDirective} from "./directives/ngLet.directive";
import {MatCardModule} from "@angular/material/card";
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr'

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    UsersListComponent,
    SearchFilterPipe,
    AddUserPopUpComponent,
    UserInfoComponent,
    LetDirective
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatSelectModule,
    FormsModule,
    MatCardModule
  ],
  providers: [
    {
      provide: IUserDbServiceToken,
      useClass: FbDbService
    },
    {
      provide: UsersToken,
      useFactory: fbDataTransformationFn
    },
    {
      provide: LOCALE_ID,
      useValue: 'fr-Fr'
    }
  ],
  exports:[
    UsersListComponent
  ]
})
export class MainContentModule { }
