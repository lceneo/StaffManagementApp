import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";

@Component({
  selector: 'app-add-user-pop-up',
  templateUrl: './add-user-pop-up.component.html',
  styleUrls: ['./add-user-pop-up.component.scss']
})
export class AddUserPopUpComponent {
  public form: FormGroup = new FormGroup({
      name: new FormControl(""),
      surname: new FormControl(""),
      patronic: new FormControl(""),
      age: new FormControl(""),
      birthdayDate: new FormControl(Date.now()),
      education: new FormControl(""),
      projectName: new FormControl(""),
      companyPosition: new FormControl(""),
      salary: new FormControl(""),
      interviewDate: new FormControl(Date.now()),
      firstWorkDayDate: new FormControl(Date.now()),
      salaryHistory: new FormControl([]),
  })
  constructor(
    private dialogRef: MatDialogRef<AddUserPopUpComponent>,
    @Inject(IUserDbServiceToken)
    private fbDb: IUserDbService) {}

  public closeDialog(){
    this.dialogRef.close();
  }

  public createUser(){
      this.fbDb.addUser(this.form.value);
      this.closeDialog();
  }
}
