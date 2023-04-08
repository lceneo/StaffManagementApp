import {Component, inject, Inject, OnInit} from '@angular/core';
import {IUser} from "../../../shared/models/IUser";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";
import {map, Observable} from "rxjs";
import {UsersToken} from "../../../shared/services/fb-db.service";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {

  public users$: Observable<IUser[]> = inject(UsersToken);

  constructor(
    @Inject(IUserDbServiceToken)
    private fbDb: IUserDbService
  ) {}

  public addUser(){
    const name1 = (document.getElementById("name") as HTMLInputElement).value;
    const surname1= (document.getElementById("surname") as HTMLInputElement).value;
    const patronic1 = (document.getElementById("patronic") as HTMLInputElement).value;
    const age1 = parseInt((document.getElementById("age") as HTMLInputElement).value);
    this.fbDb.addUser({
      name: name1,
      surname: surname1,
      patronic: patronic1,
      age: age1
    })
  }

  public updateUser(){

  }

  public deleteUser(user: IUser){
    this.fbDb.deleteStudent(user);
  }
}
