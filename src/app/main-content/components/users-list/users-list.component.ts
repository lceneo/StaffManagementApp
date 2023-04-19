import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Inject,
  ViewChild
} from '@angular/core';
import {IUser} from "../../../shared/models/IUser";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";
import {debounceTime, fromEvent, Observable} from "rxjs";
import {UsersToken} from "../../../shared/services/fb-db.service";
import {MatDialog} from "@angular/material/dialog";
import {AddUserPopUpComponent} from "../add-user-pop-up/add-user-pop-up.component";
import {Router} from "@angular/router";

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
    private fbDb: IUserDbService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
      fromEvent<InputEvent>(this.nameInputFilter.nativeElement, "input")
        .pipe(
          debounceTime(250)
        )
        .subscribe(v => this.nameFilterValue = this.nameInputFilter.nativeElement.value);
    }

  public openCreateUserDialog(){
     this.dialog.open(AddUserPopUpComponent,
       {
       } );
  }

  openUserDetailedInfo(userId: string){
    this.router.navigate(["users", userId])
  }
  public deleteUser(user: IUser){
    this.fbDb.deleteUser(user);
  }
}
