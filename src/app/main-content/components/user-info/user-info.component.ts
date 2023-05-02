import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  Inject, OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {IUser} from "../../../shared/models/IUser";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, delay, filter, map, mergeMap, Observable, skipWhile, Subject, tap} from "rxjs";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {FbEntitiesService} from "../../../shared/services/fb-entities.service";
import {CustomValidators} from "../../../shared/validators/CustomValidators";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent implements OnInit, OnDestroy{
  public form: FormGroup = new FormGroup({
    name: new FormControl("", [Validators.required, CustomValidators.onlyLettersValidator]),
    surname: new FormControl("", [Validators.required, CustomValidators.onlyLettersValidator]),
    patronic: new FormControl("",  CustomValidators.optionalOnlyLettersValidator),
    age: new FormControl("", [Validators.required, Validators.min(18), Validators.max(80), CustomValidators.onlyDigitsValidator]),
    gender: new FormControl("", Validators.required),
    education: new FormControl("", Validators.required),
    projectName: new FormControl("", Validators.required),
    companyPosition: new FormControl("", Validators.required),
    salary: new FormControl("", [Validators.required, Validators.min(1000), Validators.max(1000000), CustomValidators.onlyDigitsValidator]),
    birthdayDate: new FormControl(new Date(), Validators.required),
    interviewDate: new FormControl(new Date(), Validators.required),
    firstWorkDayDate: new FormControl(new Date(), Validators.required),
    salaryHistory: new FormArray([])
  });

  public user$?: Observable<IUser>;
  public userPropertyKeys: Array<{propName: string, template: TemplateRef<{propName: string}>}> = [];
  public onEdit$ = new BehaviorSubject(false);
  public salaryItemsArray!: FormArray;
  private isFirstIteration = true;
  private getUserForProps$ = new BehaviorSubject<IUser>(null as unknown as  IUser);

  @ViewChild("defaultTemplate",{static: false}) defaultTemplate!: TemplateRef<{propName: string}>;
  @ViewChild("dateTemplate",{static: false}) dateTemplate!: TemplateRef<{propName: string}>;
  @ViewChild("genderTemplate",{static: false}) genderTemplate!: TemplateRef<{propName: string}>;
  @ViewChild("salaryItemTemplate",{static: false}) salaryItemTemplate!: TemplateRef<{propName: string}>;

  @ViewChild("imgInput") imgInput!: ElementRef;
  @ViewChild("imgContainer") imgContainer!: ElementRef;

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
          .pipe
          (
            map(users => users.find(u => u.id === params["id"]) as IUser),
            skipWhile(user => !user),
            delay(0),
            tap((user) => this.initialiseUserProps(user) )
            )
        )
      );
  }

  private initialiseUserProps(user: IUser){
    if(!user)
      return;
    if(!this.isFirstIteration)
      return;
    this.isFirstIteration = false;
    Object.keys(this.form.controls).forEach(key => {
      let template;
      if(this.form.controls[key].value instanceof Date)
        template = this.dateTemplate;
      else if(Array.isArray(this.form.controls[key].value)) {
        this.initialiseSalaryItems(user);
        return;
      }
      else if(key === "gender")
        template = this.genderTemplate;
      else
        template = this.defaultTemplate;
      this.form.controls[key].setValue(user[key as keyof IUser]);
      this.userPropertyKeys.push({propName: key, template: template});
    })
    this.form.disable();
  }

  private initialiseSalaryItems(user: IUser){
    this.salaryItemsArray = this.form.controls.salaryHistory as FormArray;
    user.salaryHistory.forEach(salaryItem => this.salaryItemsArray.insert(this.salaryItemsArray.controls.length, this.createSalaryFormFromItem(salaryItem)));
  }


  public updateUserInfo(user: IUser, value: Partial<IUser>){
    const imgFile = this.imgInput.nativeElement.files[0];
    if(imgFile){
      this.getUploadImgTask(user, imgFile)
        .then((img) => {
          this.fbDb.updateUser(user, {...value, img: img})
            .then(() => {
              this.onEdit$.next(false)
              this.form.disable();
            });
        })
    }
    else {
      this.fbDb.updateUser(user, {...value})
        .then(() => {
          this.onEdit$.next(false)
          this.form.disable();
        });
    }
  }

  public fireUser(user: IUser){
    this.updateUserInfo(user, {fired: true});
  }

  public makeUserFieldsEditable(){
      this.onEdit$.next(true);
      this.form.enable();
  }

  public restoreFieldsChanges(user: IUser){
    this.onEdit$.next(false);
    for (const controlKey in this.form.controls){
      if(controlKey === "salaryHistory"){
        const lengthOfArr = this.salaryItemsArray.controls.length;
        for (let i = 0; i < lengthOfArr; i++)
          this.salaryItemsArray.removeAt(0);
        user.salaryHistory.forEach(salaryItem =>
          this.salaryItemsArray.insert(this.salaryItemsArray.controls.length, this.createSalaryFormFromItem(salaryItem)));
        continue;
      }
     this.form.get(controlKey)?.setValue(user[controlKey as keyof IUser]);
    }
    this.form.disable();
    this.imgInput.nativeElement.files = null;
    this.imgContainer.nativeElement.src = user.img || 'assets/img/temporary-user.PNG';
  }

  public returnToUsersList(){
    this.router.navigate(["users"]);
  }

  public removeSalaryHistoryItem(index: number){
    this.salaryItemsArray.removeAt(index);
  }

  public addSalaryHistoryItem(){
    this.salaryItemsArray.insert(0, this.createSalaryFormFromItem());
  }

  private createSalaryFormFromItem(salaryItem: {date: Date, salary: number} = {date: new Date(), salary: 0}){
    return new FormGroup({
      date: new FormControl(salaryItem.date),
      salary: new FormControl(salaryItem.salary, [Validators.required, Validators.min(1000), Validators.max(1000000), CustomValidators.onlyDigitsValidator])
    });
  }

  private getUploadImgTask(user: IUser, imgFile: File){
   return this.fbDb.uploadUserImg(user, imgFile)
      .then(v => v.ref.getDownloadURL());
  }

  public uploadImg(){
    this.imgContainer.nativeElement.src = URL.createObjectURL(this.imgInput.nativeElement.files[0]);
  }

  public ngOnDestroy(): void {
    this.getUserForProps$.complete();
  }
}
