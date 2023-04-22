import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Inject, ViewChild} from '@angular/core';
import {Gender, IUser, IUserFilters} from "../../../shared/models/IUser";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";
import {BehaviorSubject, debounceTime, fromEvent, Observable} from "rxjs";
import {UsersToken} from "../../../shared/services/fb-db.service";
import {MatDialog} from "@angular/material/dialog";
import {AddUserPopUpComponent} from "../add-user-pop-up/add-user-pop-up.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements AfterViewInit{

  public users$: Observable<IUser[]> = inject(UsersToken);
  public currentPage = 1;
  public itemsPerPage = 5;
  public filters$ = new BehaviorSubject<IUserFilters>({
    name: "",
    salary: {
      from: 1000,
      to: 1000000
    },
    companyPosition: "",
    gender: Gender.Undefined,
    projectName: ""
  });

  public initialFilters: IUserFilters = {
    name: "",
    salary: {
      from: 1000,
      to: 1000000
    },
    companyPosition: "",
    gender: Gender.Undefined,
    projectName: ""
  }
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
        .subscribe(() => this.filters$.next({...this.filters$.value, name: this.nameInputFilter.nativeElement.value}));
    }

  public resetFilters(){
    this.nameInputFilter.nativeElement.value = this.initialFilters.name;
    const salary = {...this.initialFilters.salary}
    this.filters$.next({...this.initialFilters, salary});
  }

  public filtersAreSet() {
    const currentFilters = this.filters$.value;
    for (let prop in currentFilters) {
      if(prop === "salary" ){
        if(currentFilters.salary.from !== this.initialFilters.salary.from || currentFilters.salary.to !== this.initialFilters.salary.to)
          return true;
        continue;
      }
      // @ts-ignore
      if(currentFilters[prop] !== this.initialFilters[prop])
        return true;
    }
    return false;
  }
  public openCreateUserDialog(){
     this.dialog.open(AddUserPopUpComponent,
       {
         autoFocus: false
       } );
  }

  public openUserDetailedInfo(userId: string){
    this.router.navigate(["users", userId])
  }
  public deleteUser(user: IUser){
    this.fbDb.deleteUser(user);
  }
}
