import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {IUser} from "../../../shared/models/IUser";
import {UsersToken} from "../../../shared/services/fb-db.service";
import {IProject} from "../../../shared/models/IProject";

@Component({
  selector: 'app-add-project-pop-up[isVisible]',
  templateUrl: './add-project-pop-up.component.html',
  styleUrls: ['./add-project-pop-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProjectPopUpComponent{
  @Input() isVisible?: boolean
  @Output() closePopUpEvent = new EventEmitter()
  @Output() createProjectEvent = new EventEmitter()

  public users$: Observable<IUser[]> = inject(UsersToken);

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    staff: new FormControl([], [Validators.required])
  })

  constructor(private cdr: ChangeDetectorRef) {
  }

  closePopUp(){
    this.closePopUpEvent.emit()
  }

  onSubmit(){
    const project: IProject = {
      name: this.form.controls['name'].value,
      description: this.form.controls['description'].value,
      staff: this.form.controls['staff'].value,
    }
    this.closePopUpEvent.emit()
    this.createProjectEvent.emit(project)
    this.form.reset()
  }
}
