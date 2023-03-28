import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {CustomValidators} from "../../helpers/validators/CustomValidators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../authorization-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  public form: FormGroup = new FormGroup({
      email: new FormControl("", [Validators.required, CustomValidators.customEmailValidator]),
      password: new FormControl("", [Validators.required, Validators.minLength(6)])
  });

  constructor
  (
    private authS: AuthService,
    private router: Router
  ) {}

  public signIn(): void{
    this.authS.login({
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value
    })
      .then(() => this.router.navigate(["users"]))
      .catch(() => alert("incorrect"));
   }

  public redirectToSignUp(): void{
      this.router.navigate(["registration"]);
   }
}
