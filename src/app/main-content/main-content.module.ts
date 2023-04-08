import {inject, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsersListComponent} from "./components/users-list/users-list.component";
import {IUserDbServiceToken} from "../shared/interfaces/IUserDbService";
import {fbDataTransformationFn, FbDbService, UsersToken} from "../shared/services/fb-db.service";
import {map} from "rxjs";



@NgModule({
  declarations: [
    UsersListComponent
  ],
  imports: [
    CommonModule
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
