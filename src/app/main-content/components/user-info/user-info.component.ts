import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {IUser} from "../../../shared/models/IUser";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, map, mergeMap, Observable, tap} from "rxjs";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import firebase from "firebase/compat/app";

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(IUserDbServiceToken)
    private fbDb: IUserDbService
  ) {}

  public ngOnInit(): void {
    let isFirst = false;
    this.user$ = this.activatedRoute.params
      .pipe(
        mergeMap(params => this.fbDb.getUserById$(params["id"])),
        map((res, index) => {
          if(index === 0)
            isFirst = true;
          const data = res[0].payload.doc.data();
          //@ts-ignore;
          const [birthdayDate, interviewDate, firstWorkDayDate] = [new Date(data.birthdayDate.seconds * 1000), new Date(data.interviewDate.seconds * 1000),  new Date(data.firstWorkDayDate.seconds * 1000)]
          //@ts-ignore;
          const salaryHistory = data.salaryHistory.map(salaryItem => ({date: new Date(salaryItem.date.seconds * 1000), salary: salaryItem.salary}));
          return {...data, birthdayDate: birthdayDate, interviewDate: interviewDate, firstWorkDayDate: firstWorkDayDate, salaryHistory: salaryHistory} as unknown as IUser;
        }),
        tap(user => {
          if(isFirst)
            this.initialiseFormControlsFromUserInfo(user);
          isFirst = false;
        }
      ));
  }

  private initialiseFormControlsFromUserInfo(user: IUser){
    Object.keys(user).forEach((key) => {
      if(key === "id" || key === "salaryHistory")
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
  public updateUserInfo(user: IUser){
    this.fbDb.updateUser(user, {...this.form.value, salaryHistory: this.salaryItemsArray.value})
      .then(() => this.onEdit$.next(false));
  }
  public makeUserFieldsEditable(){
      this.onEdit$.next(true);
  }

  public restoreFieldsChanges(user: IUser){
    let userWithoutID = {...user};
    delete userWithoutID.id;
    this.onEdit$.next(false);
    for (const controlKey in this.form.controls){
     this.form.setValue(userWithoutID);
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
