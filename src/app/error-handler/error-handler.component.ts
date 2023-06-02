import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ValidationErrors} from "@angular/forms";

@Component({
  selector: 'app-error-handler',
  templateUrl: './error-handler.component.html',
  styleUrls: ['./error-handler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorHandlerComponent {
  @Input()
  public set errors(error: ValidationErrors | Error | null) {
    if(this.previousErrors && JSON.stringify(this.previousErrors) ===  JSON.stringify(error))
      return;
    this.outErrors = [];
    this.previousErrors = error;
    this.updateErrors(error);
  };

  public outErrors: string[] = [];
  private previousErrors?: ValidationErrors | Error | null;

  private updateErrors(error: ValidationErrors | Error | null) {
    if (!error)
      return;
    else if (error instanceof Error) {
      this.outErrors.push(error.message)
      return;
    }
    const errorsObj = error as ValidationErrors;
    for (const err in errorsObj) {
      switch (err) {
        case "required":
          this.outErrors.push("Обязательное поле");
          break;
        case "minlength":
          this.outErrors.push(`Минимальная длина пароля — ${errorsObj[err].requiredLength} cимволов`);
          break;
        case "maxlength":
          this.outErrors.push(`Максимальная длина пароля — ${errorsObj[err].requiredLength} cимволов`);
          break;
        case "min":
          this.outErrors.push(`Минимальная зарплата — ${errorsObj[err].min} RUB`);
          break;
        case "max":
          this.outErrors.push(`Максимальная зарплата — ${errorsObj[err].max} RUB`);
          break;
        case "emailValidator" :
          this.outErrors.push("Некорректный формат email");
          break;
        case "passwordsMismatch" :
          this.outErrors.push("Пароли не совпадают");
          break;
        case "onlyLettersValidator" :
          this.outErrors.push("Должно содержать только буквы");
          break;
        case "onlyDigitsValidator" :
          this.outErrors.push("Должно содержать только цифры");
          break
        case "spaceValidator" :
          this.outErrors.push("Не должно содержать пробелов");
          break;
        case "ageValidator" :
          this.outErrors.push("Минимальный возраст — 18 лет");
          break;
      }
    }
  }
}
