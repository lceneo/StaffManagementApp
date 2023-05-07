import {AbstractControl, FormControl} from "@angular/forms";

export class CustomValidators{

  public static emailValidator(control: FormControl<string>){
    const firstSegmentAllowedSymbols = /^[a-zA-Z0-9,.`/\-_#$%&?*()~;^:\\]+$/;
    const secondSegmentAllowedSymbols = /^[a-z.]+$/;
    let currentSplitState = control.value.split('@');
    if(currentSplitState.length !== 2)
      return {emailValidator: true};
    if(!firstSegmentAllowedSymbols.test(currentSplitState[0]) || !secondSegmentAllowedSymbols.test(currentSplitState[1]))
      return {emailValidator: true};
    currentSplitState = currentSplitState[1].split('.');
    if(currentSplitState.length !== 2 || currentSplitState[1].length === 0)
      return {emailValidator: true};
    return null;
  }

  public static spaceValidator(control: AbstractControl){
    return !control.value.includes(" ") ? null : {spaceValidator: true};
  }

  public static onlyLettersValidator(control: AbstractControl){
    return /^[a-zA-Zа-яА-ЯёЁ]+$/.test(control.value) ? null : {onlyLettersValidator: true};
  }

  public static ageValidator(control:AbstractControl){
    const controlDate = control.value as Date;
    const currentDate = new Date();
    const yearsDistiction = currentDate.getFullYear() - controlDate.getFullYear();
    if(yearsDistiction < 18)
      return { ageValidator: true };
    const monthDistiction = currentDate.getMonth() - controlDate.getMonth();
    return yearsDistiction > 18 ||
      (monthDistiction > 0 || (monthDistiction === 0 && currentDate.getDate() >= controlDate.getDate())) ? null : { ageValidator: true };
  }

  public static optionalOnlyLettersValidator(control: AbstractControl){
    return /^[a-zA-Zа-яА-ЯёЁ]+$/.test(control.value) || control.value.length === 0 ? null : {onlyLettersValidator: true};
  }

  public static onlyDigitsValidator(control: AbstractControl){
    return /^[0-9]+$/.test(control.value) ? null : {onlyDigitsValidator: true};
  }
}
