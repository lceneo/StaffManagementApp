import { Pipe, PipeTransform} from '@angular/core';
import {IUser} from "../../shared/models/IUser";
import {IProject} from "../../shared/models/IProject";

@Pipe({
  name: 'userProjects'
})
export class UserProjectsPipe implements PipeTransform {
  transform(user: IUser, projects: IProject[]): string {
    if(!user)
      return "";
    const suitableProjArr = projects.filter(p =>
      p.staff
        .map(s => s.id)
        .includes(user.id)
    );
    return suitableProjArr.length ? suitableProjArr.map(p => p.name).join(', ') : "Без проекта";
  }
}
