import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../helpers/validators/CustomValidators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss', '../authorization-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent {

  public form: FormGroup = new FormGroup({
    email: new FormControl<string>("", [Validators.required, CustomValidators.customEmailValidator]),
    password: new FormControl<string>("", [Validators.required, Validators.minLength(6)]),
    repeatPassword: new FormControl<string>("", [Validators.required, Validators.minLength(6)])
  });

  constructor
  (
    private authS: AuthService,
    private router: Router
  ) {}

  public signUp(): void{
    const firstPasswordValue: string = this.form.controls['password'].value;
    const secondPasswordValue: string = this.form.controls['repeatPassword'].value;
    if(firstPasswordValue !== secondPasswordValue)
      return;
    this.authS.register({
      email: this.form.controls['email'].value,
      password: firstPasswordValue
    })
      .then(() => this.router.navigate(["login"]))
      .catch(() => alert("incorrect"));
  }

  public redirectToSignIn(): void{
    this.router.navigate(["login"]);
  }
}
