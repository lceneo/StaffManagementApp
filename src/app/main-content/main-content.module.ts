import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsersListComponent} from "./components/users-list/users-list.component";



@NgModule({
  declarations: [
    UsersListComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    UsersListComponent
  ]
})
export class MainContentModule { }
