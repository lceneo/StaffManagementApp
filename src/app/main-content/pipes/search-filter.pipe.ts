import { Pipe, PipeTransform} from '@angular/core';
import {CompanyPosition, Gender, IUser, IUserFilters} from "../../shared/models/IUser";
import {IProject} from "../../shared/models/IProject";

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(users: IUser[] | null, filters: IUserFilters, projects: IProject[]): IUser[] {
    if(!users)
      return [];
    else if(!filters)
      return users;
    return users.filter(u =>
      (`${u.surname} ${u.name} ${u.patronic}`.toLowerCase().includes(filters.name.toLowerCase()) || !filters.name)
      && u.salary >= filters.salaryFrom && u.salary <= filters.salaryTo
      && (u.companyPosition === filters.companyPosition || filters.companyPosition === CompanyPosition.Undefined)
      && (u.gender === filters.gender || filters.gender === Gender.Undefined)
      && (filters.projectName === "Любой" || projects.find(p => p.id === filters.projectName)?.staff
        .some(s => s.id === u.id) || !filters.projectName)
      && (u.fired === filters.fired)
    );
  }
}
