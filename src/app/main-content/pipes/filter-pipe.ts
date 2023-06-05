import { Pipe, PipeTransform } from '@angular/core';
import {IUser} from "../../shared/models/IUser";
import {IProject, IProjectFilters} from "../../shared/models/IProject";

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(projects: IProject[] | null, filters: IProjectFilters): IProject[] {
    if (!projects){
      return []
    }
    return projects.filter((value) => {
      for (const user of filters.staff){
        if (value.staff.filter((v: IUser) => v.id === user.id).length === 0){
          return false
        }
      }
      return value.name.toLowerCase().includes(filters.name.toLowerCase())
    })
  }
}
