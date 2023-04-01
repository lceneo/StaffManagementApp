import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ValidationErrors} from "@angular/forms";

@Component({
  selector: 'app-error-handler',
  templateUrl: './error-handler.component.html',
  styleUrls: ['./error-handler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorHandlerComponent implements OnInit{
  @Input() errors?: ValidationErrors | Error | null;
  public errorText: string = "";

  public ngOnInit(): void {
    if(!this.errors)
      return;
    else if(this.errors instanceof Error){
      this.errorText = this.errors.message;
      return;
    }
    const errorsObj = this.errors as ValidationErrors;
    for (const err in errorsObj) {
      switch (err){
        case "required":
          this.errorText = "Обязательное поле"
          return;
        case "minlength":
          this.errorText = `Минимальная длина пароля — ${errorsObj[err].requiredLength} cимволов`
          return;
        case "maxlength":
          this.errorText = `Максимальная длина пароля — ${errorsObj[err].requiredLength} cимволов`
          return;
        case "emailValidator" :
          this.errorText = "Некорректный формат email"
          return;
      }
    }
  }
}
