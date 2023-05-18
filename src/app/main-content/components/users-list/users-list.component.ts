import {ChangeDetectionStrategy, Component, inject, Inject, OnInit,} from '@angular/core';
import {IUserFilters} from "../../../shared/models/IUser";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";
import {
  BehaviorSubject,
  skipWhile,
  tap
} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {FbEntitiesService} from "../../../shared/services/fb-entities.service";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent{

  public isLoading$ =  new BehaviorSubject<boolean>(true);
  private isFirstIteration = true;

  public users$ = inject(FbEntitiesService).users$
                                            .pipe(
                                              skipWhile(users => !users),
                                              tap(() => {
                                                if(this.isFirstIteration){
                                                  this.dissolveLoadingEffect(250);
                                                  this.isFirstIteration = false;
                                                }
                                              })
                                            );
  public currentPage = 1;
  public itemsPerPage = 5;
  public filters$ = new BehaviorSubject<IUserFilters>(null as unknown as IUserFilters);
  public savedFilters?: IUserFilters;

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

  private dissolveLoadingEffect(interval: number){
    const timer = setTimeout(() => {
      this.isLoading$.next(false);
      clearTimeout(timer)
    }, interval);
  }

  public changePage(newPage: number){
    this.isLoading$.next(true);
    this.dissolveLoadingEffect(250);
    this.currentPage = newPage;
    this.savedFilters = JSON.parse(JSON.stringify(this.filters$.value));
  }

}
