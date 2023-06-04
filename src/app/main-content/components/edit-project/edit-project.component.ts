import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {IUser} from "../../../shared/models/IUser";
import {UsersToken} from "../../../shared/services/fb-db.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IProject} from "../../../shared/models/IProject";

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['../add-project-pop-up/add-project-pop-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProjectComponent implements OnInit{
  @Input() isVisible?: boolean;
  @Input() projectToUpdate?: BehaviorSubject<IProject | null>
  @Output() closePopUpEvent = new EventEmitter();
  @Output() updateProjectEvent = new EventEmitter();
  public users$: Observable<IUser[]> = inject(UsersToken);

  form: FormGroup = new FormGroup({
    name: new FormControl(this.projectToUpdate?.value?.name),
    description: new FormControl(this.projectToUpdate?.value?.description),
    staff: new FormControl(this.projectToUpdate?.value?.staff)
  })

  ngOnInit() {
    this.projectToUpdate?.subscribe((value) => {
      this.form = new FormGroup({
        name: new FormControl(value?.name, [Validators.required]),
        description: new FormControl(value?.description),
        staff: new FormControl([], [])
      })
    })
  }

  closePopUp(){
    this.closePopUpEvent.emit()
  }

  deleteUser(id: string | undefined){
    if (this.projectToUpdate?.value){
      this.projectToUpdate.next({...this.projectToUpdate.value, staff: this.projectToUpdate.value.staff.filter((v: IUser) => v.id !== id)})
    }
  }

  onSubmit(){
    if (this.projectToUpdate?.value){
      const project: IProject = {
        name: this.form.controls['name'].value,
        description: this.form.controls['description'].value,
        staff: this.projectToUpdate.value.staff.concat(this.form.controls['staff'].value),
      }
      console.log(project)
      this.updateProjectEvent.emit(project)
      this.closePopUpEvent.emit()
    }
  }

  isDisabledOption(user: IUser): boolean{
    return this.projectToUpdate?.value?.staff.map((v: IUser) => v.id).includes(user.id) || false
  }
}
