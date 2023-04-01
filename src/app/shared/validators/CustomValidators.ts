import {FormControl} from "@angular/forms";

export class CustomValidators{

  public static emailValidator(control: FormControl<string>){
    let currentSplitState = control.value.split('@').filter(e => e != "");
    if(currentSplitState.length !== 2)
      return {emailValidator: true};
    const regExpAllowUpperAndDigits = /^[a-zA-Z0-9\.]+$/;
    const regExpBanUpper = /^[a-z\.]+$/;
    if(!regExpAllowUpperAndDigits.test(currentSplitState[0]) || !regExpBanUpper.test(currentSplitState[1]))
      return {emailValidator: true};
    currentSplitState = currentSplitState[1].split('.').filter(e => e != "")
    if(currentSplitState.length < 2)
      return {emailValidator: true};
    return null;
  }
}
