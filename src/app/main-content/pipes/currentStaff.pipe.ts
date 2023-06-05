import { Pipe, PipeTransform} from '@angular/core';
import {IProject} from "../../shared/models/IProject";
import {IUser} from "../../shared/models/IUser";

@Pipe({
  name: 'currentStaff'
})
export class CurrentStaffPipe implements PipeTransform {
  transform(project: IProject, staffState: IUser[]): IUser[] {
    return staffState.filter(staff => project.staff.some(s => staff.id === s.id));
  }
}

