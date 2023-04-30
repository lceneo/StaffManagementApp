import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {IUser, IUserFb} from "../../../shared/models/IUser";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, map, mergeMap, Observable, tap} from "rxjs";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {FbEntitiesService} from "../../../shared/services/fb-entities.service";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent implements OnInit{
  public user$?: Observable<IUser>;
  public userPropertyKeys: Array<{propName: string, type: string, value: any}> = [];
  public onEdit$ = new BehaviorSubject(false);
  public form = new FormGroup({});
  public salaryItemsArray!: FormArray;
  private isFirstIteration = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(IUserDbServiceToken)
    private fbDb: IUserDbService,
    private fbEntities: FbEntitiesService
  ) {}

  public ngOnInit(): void {
    this.user$ = this.activatedRoute.params
      .pipe(
        mergeMap(params => this.fbEntities.users$
          .pipe(map(users => users.find(u => u.id === params["id"]) as IUser))
            .pipe(
        tap(user => {
          if(this.isFirstIteration)
            this.initialiseFormControlsFromUserInfo(user);
        }
      ))));
  }

  private initialiseFormControlsFromUserInfo(user: IUser){
    if(!user)
      return;
    this.isFirstIteration = false;
    Object.keys(user).forEach((key) => {
      if(key === "id" || key === "salaryHistory" || key === "lastPromotion" || key === "fired" || key === "img")
        return;
      let type = "text";
      const value = user[key as keyof IUser];
      if(key === "gender")
        type = "gender";
      else if(key === "birthdayDate" || key === "interviewDate" || key === "firstWorkDayDate")
        type = "date"
      this.userPropertyKeys.push({propName: key, type: type, value: value});
      this.form.addControl(key, new FormControl(value));
    })
    const salaryHistoryControls = user.salaryHistory.map(salaryItem =>
      new FormGroup({date: new FormControl(new Date(salaryItem.date)), salary: new FormControl(salaryItem.salary)}));
    this.salaryItemsArray = new FormArray(salaryHistoryControls);
    this.form.addControl("salaryHistory", this.salaryItemsArray);
  }
  public updateUserInfo(user: IUser, value: Partial<IUser>){
    this.fbDb.updateUser(user, {...value})
      .then(() => this.onEdit$.next(false));
  }

  public fireUser(user: IUser){
    this.updateUserInfo(user, {fired: true});
  }

  public makeUserFieldsEditable(){
      this.onEdit$.next(true);
  }

  public restoreFieldsChanges(user: IUser){
    this.onEdit$.next(false);
    for (const controlKey in this.form.controls){
     this.form.get(controlKey)?.setValue(user[controlKey as keyof IUser]);
    }
  }

  public returnToUsersList(){
    this.router.navigate(["users"]);
  }

  public removeSalaryHistoryItem(index: number){
    this.salaryItemsArray.removeAt(index);
  }

  public addSalaryHistoryItem(){
    this.salaryItemsArray.insert(0, this.getEmptySalaryForm());
  }
  private getEmptySalaryForm(){
    return new FormGroup({
      date: new FormControl(new Date()),
      salary: new FormControl()
    });
  }
}
