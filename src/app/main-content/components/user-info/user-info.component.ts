import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  Inject, OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {IUser} from "../../../shared/models/IUser";
import {ActivatedRoute, Router} from "@angular/router";
import {
  BehaviorSubject,
  debounceTime,
  map,
  mergeMap,
  Observable,
  skipWhile,
  Subject,
  takeUntil,
  tap
} from "rxjs";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {FbEntitiesService, initialUsersState} from "../../../shared/services/fb-entities.service";
import {CustomValidators} from "../../../shared/validators/CustomValidators";
import {MatDialog} from "@angular/material/dialog";
import {ModalWindowComponent} from "../modal-window/modal-window.component";
import {ListStateSaveService} from "../../services/list-state-save.service";

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
    gender: new FormControl("", Validators.required),
    education: new FormControl("", Validators.required),
    projectName: new FormControl("", Validators.required),
    companyPosition: new FormControl("", Validators.required),
    birthdayDate: new FormControl(new Date(), [Validators.required, CustomValidators.ageValidator]),
    interviewDate: new FormControl(new Date(), Validators.required),
    firstWorkDayDate: new FormControl(new Date(), Validators.required),
    salaryHistory: new FormArray([])
  });

  public user$?: Observable<IUser>;
  private user?: IUser;
  private destroy$ = new Subject<boolean>();
  public profileInfoHasChanged$ = new BehaviorSubject<boolean>(false);
  public userPropertyKeys: Array<{propName: string, templateName: string}> = [];
  public onEdit$ = new BehaviorSubject(false);
  public salaryItemsArray!: FormArray;
  public salaryRaising: number[] = [];
  private isFirstIteration = true;
  public isLoading$ = new BehaviorSubject<boolean>(true);
  private imgChanged = false;

  @ViewChild("imgInput") imgInput!: ElementRef;
  @ViewChild("imgContainer") imgContainer!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(IUserDbServiceToken)
    private fbDb: IUserDbService,
    private fbEntities: FbEntitiesService,
    private listStateS: ListStateSaveService,
    public dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.user$ = this.activatedRoute.params
      .pipe(
        mergeMap(params => this.fbEntities.users$
          .pipe
          (
            map(users => [users.find(u => u.id === params["id"]), users === initialUsersState] as [IUser, boolean]),
            skipWhile(([user, isInitialState]) => isInitialState),
            map(([user, isInitial]) => user),
            tap(user =>{
              if(!user){
                this.router.navigate(["unknown-page"]);
                return;
              }
              this.initialiseUserProps(user);
              this.user = user;
            })
            )
        )
      );
    this.form.valueChanges
      .pipe(
        debounceTime(100),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.valuesHasChanged())
  }

  private initialiseUserProps(user: IUser){
    if(!this.isFirstIteration)
      return;
    this.isFirstIteration = false;
    Object.keys(this.form.controls).forEach(key => {
      let template = "defaultTemplate"
      if(this.form.controls[key].value instanceof Date)
        template = "dateTemplate";
      else if(Array.isArray(this.form.controls[key].value)) {
        this.initialiseSalaryItems(user);
        return;
      }
      else if(key === "gender")
        template = "genderTemplate";
      else if(key === "companyPosition")
        template = "companyPositionTemplate";
      this.form.controls[key].setValue(user[key as keyof IUser]);
      this.userPropertyKeys.push({propName: key, templateName: template});
    })
    this.dissolveLoadingEffect(250);
    this.form.disable();
  }

  private initialiseSalaryItems(user: IUser){
    this.salaryItemsArray = this.form.controls.salaryHistory as FormArray;
    for (let i = 0; i < user.salaryHistory.length; i++) {
      this.salaryItemsArray.insert(this.salaryItemsArray.controls.length, this.createSalaryFormFromItem(user.salaryHistory[i]));
      if(i > 0)
        this.salaryRaising.push(Math.round((user.salaryHistory[i - 1].salary / (user.salaryHistory[i].salary / 100) - 100)));
    }
  }


  public updateUserInfo(user: IUser, value: Partial<IUser>){
    this.isLoading$.next(true);
    const valueWithSalaryAndAge = {
      ...value,
      salary: this.salaryItemsArray.controls[0].value.salary,
      age: this.calculateAgeFromBirthday(this.form.value.birthdayDate)
    };
    const imgFile = this.imgInput.nativeElement.files[0];
    if(imgFile){
      this.getUploadImgTask(user, imgFile)
        .then((img) => {
          this.fbDb.updateUser(user, {...valueWithSalaryAndAge, img: img})
            .then(() => {
              this.afterInfoUpdated();
            });
        })
    }
    else {
      this.fbDb.updateUser(user, {...valueWithSalaryAndAge})
        .then(() => {
          this.afterInfoUpdated();
        });
    }
  }

  public fireOrHireUser(user: IUser){
    this.updateUserInfo(user, {fired: !user.fired});
  }

  private updateSalaryRaisings(){
    this.salaryRaising = [];
    for (let i = 0; i < this.salaryItemsArray.controls.length; i++) {
      if(i > 0)
        this.salaryRaising.push(Math.round(this.salaryItemsArray.controls[i - 1].value.salary / (this.salaryItemsArray.controls[i].value.salary / 100) - 100));
    }
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
    this.imgInput.nativeElement.value = null;
    this.imgContainer.nativeElement.src = user.img || 'assets/img/temporary-user.PNG';
  }

  public returnToUsersList(){
    const savedListState = this.listStateS.getState();
    if(savedListState) {
      this.router.navigate(["users"], {
        queryParams: {page: savedListState.page}
      });
    }
    else {
      this.router.navigate(["users"]);
    }
  }

  public removeSalaryHistoryItem(index: number){
    this.salaryItemsArray.removeAt(index);
  }

  public addSalaryHistoryItem(){
    this.salaryItemsArray.insert(0, this.createSalaryFormFromItem());
  }

  private createSalaryFormFromItem(salaryItem: {date: Date, salary: number} = {date: new Date(), salary: 0}){
    return new FormGroup({
      date: new FormControl(salaryItem.date, Validators.required),
      salary: new FormControl(salaryItem.salary, [Validators.required, Validators.min(1000), Validators.max(1000000), CustomValidators.onlyDigitsValidator])
    });
  }

  private getUploadImgTask(user: IUser, imgFile: File){
   return this.fbDb.uploadUserImg(user, imgFile)
      .then(v => v.ref.getDownloadURL());
  }

  public uploadImg(){
    this.imgContainer.nativeElement.src = URL.createObjectURL(this.imgInput.nativeElement.files[0]);
    this.imgChanged = true;
    this.profileInfoHasChanged$.next(true);
  }

  public openLeaveDialog(user: IUser){
    if(!this.profileInfoHasChanged$.value) {
      this.restoreFieldsChanges(user);
      return;
    }
    const dialogRef = this.dialog.open(ModalWindowComponent, {
      data: {
        title: "Изменения не сохранены",
        text: "Вы действительно хотите выйти из режима редактирования? Все несохранённые изменения будут утеряны",
        confirmButtonText: "Выйти из режима редактирования",
        cancelButtonText: "Отмена"
      }
    });
    dialogRef.afterClosed().subscribe(v => {
      if(v)
        this.restoreFieldsChanges(user);
    });
  }

  private dissolveLoadingEffect(interval: number){
    const timer = setTimeout(() => {
      this.isLoading$.next(false);
      clearTimeout(timer)
    }, interval);
  }

  private valuesHasChanged(){
    for (const valueProp in this.form.value) {
      if(JSON.stringify(this.user![valueProp as keyof IUser]) !== JSON.stringify(this.form.value[valueProp])) {
        console.log(this.user![valueProp as keyof IUser], this.form.value[valueProp]);
        this.profileInfoHasChanged$.next(true);
        return;
      }
    }
    this.profileInfoHasChanged$.next(false);
  }

  private calculateAgeFromBirthday(birthdayDate: Date){
    const currentDate = new Date();
    const yearsDistiction = currentDate.getFullYear() - birthdayDate.getFullYear();
    const monthDistiction = currentDate.getMonth() - birthdayDate.getMonth();
    if(monthDistiction < 0 || (monthDistiction === 0 && currentDate.getDate() < birthdayDate.getDate()))
      return yearsDistiction - 1;
    else
      return yearsDistiction;
  }

  private afterInfoUpdated(){
    this.onEdit$.next(false)
    this.updateSalaryRaisings();
    this.form.disable();
    this.dissolveLoadingEffect(0);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete()
  }
}
