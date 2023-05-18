import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Inject, OnInit,} from '@angular/core';
import {IUserFilters} from "../../../shared/models/IUser";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";
import {
  BehaviorSubject,
  skipWhile, take,
  tap
} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {FbEntitiesService} from "../../../shared/services/fb-entities.service";
import {ListStateSaveService} from "../../services/list-state-save.service";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit{

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
    private route: ActivatedRoute,
    private listStateS: ListStateSaveService
  ) {}

  public ngOnInit(): void {
    this.route.queryParams
      .pipe(
        take(1)
      )
      .subscribe(params => this.currentPage = Number(params["page"]));
  }


  public openCreateUserDialog(){
     this.router.navigate(["create"], {relativeTo: this.route });
  }

  public openUserDetailedInfo(userId: string){
    this.listStateS.setState({
      page: this.currentPage,
      filters: this.filters$.value
    });
    this.router.navigate([userId], {relativeTo: this.route });
  }

  private dissolveLoadingEffect(interval: number){
    const timer = setTimeout(() => {
      this.isLoading$.next(false);
      clearTimeout(timer)
    }, interval);
  }

  private updateQueryParams(){
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {
          page: this.currentPage
        },
      });
  }

  public updateFilter(newFilter: IUserFilters){
    this.filters$.next(newFilter);
    if(!this.listStateS.getState()) {
      this.currentPage = 1;
      this.updateQueryParams();
    }
  }

  public changePage(newPage: number){
    this.isLoading$.next(true);
    this.dissolveLoadingEffect(250);
    this.currentPage = newPage;
    this.savedFilters = this.filters$.value;
    this.updateQueryParams();
  }
}
