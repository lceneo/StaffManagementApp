import {LOCALE_ID, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsersListComponent} from "./components/users-list/users-list.component";
import {IUserDbServiceToken} from "../shared/interfaces/IUserDbService";
import {fbDataTransformationFn, FbDbService, fbProjectsDataTransformationFn, ProjectsToken, UsersToken} from "../shared/services/fb-db.service";
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
import {MatTooltipModule} from "@angular/material/tooltip";
import {AddProjectPopUpComponent} from "./components/add-project-pop-up/add-project-pop-up.component";
import {ProjectsListComponent} from "./components/projects-list/projects-list.component";
import {ProjectInfoComponent} from "./components/project-info/project-info.component";
import {ProjectItemComponent} from "./components/project-item/project-item.component";
import {EditProjectComponent} from "./components/edit-project/edit-project.component";
import {FilterPipe} from "./components/projects-list/filter-pipe";


@NgModule({
  declarations: [
    UsersListComponent,
    SearchFilterPipe,
    UserInfoComponent,
    SearchFiltersComponent,
    CreateUserComponent,
    ModalWindowComponent,
    AddProjectPopUpComponent,
    ProjectsListComponent,
    ProjectInfoComponent,
    ProjectItemComponent,
    EditProjectComponent,
    FilterPipe
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
      {path: "", component: UsersListComponent, pathMatch: "full"},
      {path: "create", component: CreateUserComponent, canActivate: [authGuard]},
      {path: ":id", component: UserInfoComponent, canActivate: [authGuard]},
    ]),
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule
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
      provide: ProjectsToken,
      useFactory: fbProjectsDataTransformationFn
    },
    {
      provide: LOCALE_ID,
      useValue: 'fr-Fr'
    },
    FbDbService,
    FbEntitiesService,
    ListStateSaveService
  ],
  exports:[]
})
export class MainContentModule { }
