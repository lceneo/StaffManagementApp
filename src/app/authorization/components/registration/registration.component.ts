import {AfterViewInit, ChangeDetectionStrategy, Component, Inject, ViewChild} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/validators/CustomValidators";
import {Router} from "@angular/router";
import {IAuthServiceToken} from "../../../shared/interfaces/IAuthService";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss', '../../styles/authorization-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent implements AfterViewInit{

  @ViewChild('myForm') formRef!: FormGroupDirective;
  public form: FormGroup = new FormGroup({
    email: new FormControl<string>("", [Validators.required, CustomValidators.emailValidator]),
    password: new FormControl<string>("", [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
    repeatPassword: new FormControl<string>("", [Validators.required, Validators.minLength(6), Validators.maxLength(15)])
  });

  public incorrectAccountError$: BehaviorSubject<Error | null> = new BehaviorSubject<Error | null>(null);

  constructor
  (
    @Inject(IAuthServiceToken)
    private authS: AuthService,
    private router: Router
  ) {}

  public ngAfterViewInit(): void {
    this.formRef.valueChanges?.subscribe(() => {
      if(this.incorrectAccountError$.value instanceof Error)
        this.incorrectAccountError$.next(null);
    });
  }

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
      .catch(() => this.incorrectAccountError$.next(new Error("Аккаунт с таким email уже существует")));
  }

  public redirectToSignIn(): void{
    this.router.navigate(["login"]);
  }
}
