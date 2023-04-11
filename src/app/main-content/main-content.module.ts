import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsersListComponent} from "./components/users-list/users-list.component";
import {IUserDbServiceToken} from "../shared/interfaces/IUserDbService";
import {fbDataTransformationFn, FbDbService, UsersToken} from "../shared/services/fb-db.service";
import {NgxPaginationModule} from "ngx-pagination";
import {MatInputModule} from "@angular/material/input";
import { SearchFilterPipe } from './pipes/search-filter.pipe';



@NgModule({
  declarations: [
    UsersListComponent,
    SearchFilterPipe
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    MatInputModule
  ],
  providers: [
    {
      provide: IUserDbServiceToken,
      useClass: FbDbService
    },
    {
      provide: UsersToken,
      useFactory: fbDataTransformationFn
    }
  ],
  exports:[
    UsersListComponent
  ]
})
export class MainContentModule { }
