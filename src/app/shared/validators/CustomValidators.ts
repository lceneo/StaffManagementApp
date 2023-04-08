import {FormControl} from "@angular/forms";

export class CustomValidators{

  public static emailValidator(control: FormControl<string>){
    const regExpAllowUpperAndDigits = /^[a-zA-Z0-9.]+$/;
    const regExpBanUpper = /^[a-z.]+$/;
    const regExpOnlyLowerSymbols = /^[a-z]+$/;
    let currentSplitState = control.value.split('@');
    if(currentSplitState.length !== 2)
      return {emailValidator: true};
    if(!regExpAllowUpperAndDigits.test(currentSplitState[0]) || !regExpBanUpper.test(currentSplitState[1]))
      return {emailValidator: true};
    currentSplitState = currentSplitState[1].split('.');
    if(currentSplitState.length !== 2)
      return {emailValidator: true};
    if(!regExpOnlyLowerSymbols.test(currentSplitState[0]) || !regExpOnlyLowerSymbols.test(currentSplitState[1]))
      return {emailValidator: true};
    return null;
  }
}
