import { Pipe, PipeTransform } from '@angular/core';
import {Gender, IUser, IUserFilters} from "../../shared/models/IUser";

@Pipe({
  name: 'searchFilter',
  pure: false
})
export class SearchFilterPipe implements PipeTransform {

  transform(users: IUser[] | null, filters: IUserFilters): IUser[] {
    if(!users)
      return [];
    return users.filter(u =>
      (`${u.surname} ${u.name} ${u.patronic}`.toLowerCase().includes(filters.name.toLowerCase()) || !filters.name)
      && u.salary >= filters.salary.from && u.salary <= filters.salary.to
      && (u.companyPosition === filters.companyPosition || !filters.companyPosition)
      && (u.gender === filters.gender || filters.gender === Gender.Undefined)
      && (u.projectName === filters.projectName || !filters.projectName)
    );
  }
}
