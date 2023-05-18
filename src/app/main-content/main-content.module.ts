import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsersListComponent} from "./components/users-list/users-list.component";
import {IUserDbServiceToken} from "../shared/interfaces/IUserDbService";
import {fbDataTransformationFn, FbDbService, UsersToken} from "../shared/services/fb-db.service";
import {NgxPaginationModule} from "ngx-pagination";
import {MatInputModule} from "@angular/material/input";
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { UserInfoComponent } from './components/user-info/user-info.component';
import {MatSliderModule} from "@angular/material/slider";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr'
import {SearchFiltersComponent} from "./components/search-filters/search-filters.component";
import {RouterModule} from "@angular/router";
import {authGuard} from "../shared/guards/auth.guard";
import {SharedModule} from "../shared/shared.module";
import { CreateUserComponent } from './components/create-user/create-user.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {FbEntitiesService} from "../shared/services/fb-entities.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ModalWindowComponent } from './components/modal-window/modal-window.component';
import {ListStateSaveService} from "./services/list-state-save.service";


@NgModule({
  declarations: [
    UsersListComponent,
    SearchFilterPipe,
    UserInfoComponent,
    SearchFiltersComponent,
    CreateUserComponent,
    ModalWindowComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxPaginationModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatSelectModule,
    FormsModule,
    MatCardModule,
    RouterModule.forChild([
      { path: "", component: UsersListComponent, pathMatch: "full" },
      { path: "create", component: CreateUserComponent, canActivate: [authGuard] },
      { path: ":id", component: UserInfoComponent, canActivate: [authGuard]}
    ]),
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
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
    FbEntitiesService,
    ListStateSaveService
  ],
  exports:[]
})
export class MainContentModule { }
