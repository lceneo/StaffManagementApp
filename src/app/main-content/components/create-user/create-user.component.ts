import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";
import {CustomValidators} from "../../../shared/validators/CustomValidators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit{
  public form: FormGroup = new FormGroup({
    name: new FormControl("", [Validators.required, CustomValidators.spaceValidator]),
    surname: new FormControl("", [Validators.required, CustomValidators.spaceValidator]),
    patronic: new FormControl("",  CustomValidators.spaceValidator),
    age: new FormControl("", [Validators.required, Validators.min(18), Validators.max(80)]),
    gender: new FormControl("", Validators.required),
    education: new FormControl("", Validators.required),
    projectName: new FormControl("", Validators.required),
    companyPosition: new FormControl("", Validators.required),
    salary: new FormControl("", [Validators.required, Validators.min(1000), Validators.max(1000000)]),
    birthdayDate: new FormControl(new Date(), Validators.required),
    interviewDate: new FormControl(new Date(), Validators.required),
    firstWorkDayDate: new FormControl(new Date(), Validators.required),
    salaryHistory: new FormArray([this.getEmptySalaryForm()])
  });

  public salaryHistoryForm!: FormArray;
  public userKeys: Array<{propName: string, type: string}> = [];
  constructor(
    @Inject(IUserDbServiceToken)
    private fbDb: IUserDbService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.salaryHistoryForm = this.form.controls.salaryHistory as FormArray;
    Object.keys(this.form.controls).forEach(prop => {
      let type = "text";
      if(prop === "salaryHistory")
        return;
      if(prop === "birthdayDate" || prop === "interviewDate" || prop === "firstWorkDayDate")
        type = "date";
      this.userKeys.push({propName: prop, type: type});
    })
  }

  public createUser(){
    this.fbDb.addUser({...this.form.value, salaryHistory: this.salaryHistoryForm.value});
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

  private getEmptySalaryForm(){
    return new FormGroup({
      date: new FormControl(new Date()),
      salary: new FormControl()
    });
  }
}
