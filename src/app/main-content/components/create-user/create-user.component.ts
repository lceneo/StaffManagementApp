import {ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";
import {CustomValidators} from "../../../shared/validators/CustomValidators";
import {Router} from "@angular/router";
import {IUser} from "../../../shared/models/IUser";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateUserComponent implements OnInit{
  public form: FormGroup = new FormGroup({
    name: new FormControl("", [Validators.required, CustomValidators.onlyLettersValidator]),
    surname: new FormControl("", [Validators.required, CustomValidators.onlyLettersValidator]),
    patronic: new FormControl("",  CustomValidators.optionalOnlyLettersValidator),
    age: new FormControl("", [Validators.required, Validators.min(18), Validators.max(80), CustomValidators.onlyDigitsValidator]),
    gender: new FormControl("", Validators.required),
    education: new FormControl("", Validators.required),
    projectName: new FormControl("", Validators.required),
    companyPosition: new FormControl("", Validators.required),
    birthdayDate: new FormControl(new Date(), Validators.required),
    interviewDate: new FormControl(new Date(), Validators.required),
    firstWorkDayDate: new FormControl(new Date(), Validators.required),
    salaryHistory: new FormArray([this.getEmptySalaryForm()])
  });

  @ViewChild("imgInput") imgInput!: ElementRef;
  @ViewChild("imgContainer") imgContainer?: ElementRef;

  public isLoading$ = new BehaviorSubject<boolean>(true);
  public salaryHistoryForm!: FormArray;
  public userKeys: Array<{propName: string, templateName: string}> = [];
  constructor(
    @Inject(IUserDbServiceToken)
    private fbDb: IUserDbService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.salaryHistoryForm = this.form.controls.salaryHistory as FormArray;
    Object.keys(this.form.controls).forEach(prop => {
      let templateName = "defaultTemplate";
      if(prop === "salaryHistory")
        return;
      else if(prop === "birthdayDate" || prop === "interviewDate" || prop === "firstWorkDayDate")
        templateName = "dateTemplate";
      else if(prop === "gender")
        templateName = "genderTemplate";
      else if(prop === "companyPosition")
        templateName = "companyPositionTemplate";
      this.userKeys.push({propName: prop, templateName: templateName});
    });
    this.dissolveLoadingEffect(250);
  }

  public createUser(){
    this.isLoading$.next(true);
    const imgFile = this.imgInput.nativeElement.files[0];
    const user = {...this.form.value, fired: false, salary: this.salaryHistoryForm.controls[0].value.salary};
    if(imgFile){
      this.getUploadImgTask(user, imgFile)
        .then((img) => this.fbDb.addUser({...user, img: img}))
        .then(() => this.dissolveLoadingEffect(0));
    }
    else
      this.fbDb.addUser(user)
        .then(() => this.dissolveLoadingEffect(0));
    this.returnToUsersList();
  }

  public addSalaryHistoryItem(){
    this.salaryHistoryForm.insert(0, this.getEmptySalaryForm());
  }

  public removeSalaryHistoryItem(index: number){
    this.salaryHistoryForm.removeAt(index);
  }

  public returnToUsersList(){
    this.router.navigate(["users"]);
  }

  private getUploadImgTask(user: IUser, imgFile: File){
    return this.fbDb.uploadUserImg(user, imgFile)
      .then(v => v.ref.getDownloadURL());
  }

  public uploadImg(){
    this.imgContainer!.nativeElement.src = URL.createObjectURL(this.imgInput.nativeElement.files[0]);
  }

  private getEmptySalaryForm(){
    return new FormGroup({
      date: new FormControl(new Date(), Validators.required),
      salary: new FormControl(null, [Validators.required, CustomValidators.onlyDigitsValidator, Validators.min(1000), Validators.max(1000000)])
    });
  }

  private dissolveLoadingEffect(interval: number){
    const timer = setTimeout(() => {
      this.isLoading$.next(false);
      clearTimeout(timer)
    }, interval);
  }
}
