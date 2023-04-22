import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {IUser} from "../../../shared/models/IUser";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, map, mergeMap, Observable, tap} from "rxjs";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent implements OnInit{
  public user$?: Observable<IUser>;
  public userPropertyKeys: Array<keyof Omit<IUser, "id">> = [];
  public onEdit$ = new BehaviorSubject(false);
  public form!: FormGroup;

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
          return res[0].payload.doc.data()
        }),
        tap(user => {
          if(isFirst)
            this.initialiseFormControlsFromUserInfo(user);
          isFirst = false;
        }
      ));
  }

  private initialiseFormControlsFromUserInfo(user: IUser){
    const formControls: {[p: string] : FormControl} = {};
    Object.keys(user).forEach((key) => {
      if(key === "id")
        return;
      this.userPropertyKeys.push(key as keyof Omit<IUser, "id">);
      formControls[key] = new FormControl(user[key as keyof Omit<IUser, "id">]);
    })
    this.form = new FormGroup(formControls);
  }
  public updateUserInfo(user: IUser){
    this.fbDb.updateUser(user, this.form.value)
      .then(() => this.onEdit$.next(false));
  }
  public makeUserFieldsEditable(){
      this.onEdit$.next(true);
  }

  public restoreFieldsChanges(user: IUser){
    this.onEdit$.next(false);
    for (const controlKey in this.form.controls)
      this.form.controls[controlKey].setValue(user[controlKey as keyof IUser]);
  }

  public returnToUsersList(){
    this.router.navigate(["users"]);
  }
}
