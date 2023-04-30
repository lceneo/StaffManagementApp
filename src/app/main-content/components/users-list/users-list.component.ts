import { ChangeDetectionStrategy, Component, inject, Inject, } from '@angular/core';
import { IUser, IUserFilters} from "../../../shared/models/IUser";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";
import {BehaviorSubject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {FbEntitiesService} from "../../../shared/services/fb-entities.service";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent {

  public users$: BehaviorSubject<IUser[]> = inject(FbEntitiesService).users$;
  public currentPage = 1;
  public itemsPerPage = 5;
  public filters$ = new BehaviorSubject<IUserFilters>(null as unknown as IUserFilters);

  constructor(
    @Inject(IUserDbServiceToken)
    private fbDb: IUserDbService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public openCreateUserDialog(){
     this.router.navigate(["create"], {relativeTo: this.route });
  }

  public openUserDetailedInfo(userId: string){
    this.router.navigate([userId], {relativeTo: this.route });
  }

  public deleteUser(user: IUser){
    this.fbDb.deleteUser(user);
  }
}
