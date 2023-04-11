import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Inject,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {IUser} from "../../../shared/models/IUser";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";
import {debounceTime, distinct, distinctUntilChanged, fromEvent, map, Observable} from "rxjs";
import {UsersToken} from "../../../shared/services/fb-db.service";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements AfterViewInit{

  public users$: Observable<IUser[]> = inject(UsersToken);
  public nameFilterValue: string = "";
  public currentPage = 1;
  public itemsPerPage = 5;
  @ViewChild("nameInput") nameInputFilter!: ElementRef;

  constructor(
    @Inject(IUserDbServiceToken)
    private fbDb: IUserDbService
  ) {}

  ngAfterViewInit(): void {
      fromEvent<InputEvent>(this.nameInputFilter.nativeElement, "input")
        .pipe(
          debounceTime(250)
        )
        .subscribe(v => this.nameFilterValue = this.nameInputFilter.nativeElement.value);
    }

  public updateUser(){

  }

  public deleteUser(user: IUser){
    this.fbDb.deleteStudent(user);
  }
}
