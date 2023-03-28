import {FormControl} from "@angular/forms";

export class CustomValidators{

  public static customEmailValidator(control: FormControl<string>){
    let currentSplitState = control.value.split('@').filter(e => e != "");
    if(currentSplitState.length < 2)
      return {incorrectEmail: true};
    const regExpAllowUpper = /^[a-zA-Z\.]+$/;
    const regExpBanUpper = /^[a-z\.]+$/;
    if(!regExpAllowUpper.test(currentSplitState[0]) || !regExpBanUpper.test(currentSplitState[1]))
      return {incorrectEmail: true};
    currentSplitState = currentSplitState[1].split('.').filter(e => e != "")
    if(currentSplitState.length < 2)
      return {incorrectEmail: true};
    return null;
  }
}
