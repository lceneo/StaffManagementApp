import { Pipe, PipeTransform } from '@angular/core';
import {IUser} from "../../shared/models/IUser";

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(users: IUser[] | null, nameFilter: string): IUser[] {
    if(!users)
      return [];
    return !nameFilter ? users
      : users.filter(u => `${u.surname} ${u.name} ${u.patronic}`.toLowerCase().includes(nameFilter.toLowerCase()));
  }
}
