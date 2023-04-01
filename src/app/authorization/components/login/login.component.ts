import {AfterViewInit, ChangeDetectionStrategy, Component, Inject, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {CustomValidators} from "../../../shared/validators/CustomValidators";
import {IAuthServiceToken} from "../../../shared/interfaces/IAuthService";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../styles/authorization-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements AfterViewInit{

  @ViewChild('myForm') formRef!: FormGroupDirective;

  public form: FormGroup = new FormGroup({
      email: new FormControl("", [Validators.required, CustomValidators.emailValidator]),
      password: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(15)])
  });

  public incorrectAccountError$: BehaviorSubject<Error | null> = new BehaviorSubject<Error | null>(null);

  constructor
  (
    @Inject(IAuthServiceToken)
    private authS: AuthService,
    private router: Router,
  ) {}

  public ngAfterViewInit(): void {
        this.formRef.valueChanges?.subscribe(() => {
          if(this.incorrectAccountError$.value instanceof Error)
            this.incorrectAccountError$.next(null);
        });
    }

  public signIn(): void{
    this.authS.login({
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value
    })
      .then((sessionInfo) => {
        this.authS.saveSessionInfo(sessionInfo);
        this.router.navigate(["users"]);
      })
      .catch(() => this.incorrectAccountError$.next(new Error("Некорректный email или пароль")));
   }

  public redirectToSignUp(): void{
      this.router.navigate(["registration"]);
   }
}
