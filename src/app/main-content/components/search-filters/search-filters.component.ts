import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {BehaviorSubject, debounceTime, Observable, Subject, takeUntil} from "rxjs";
import {CompanyPosition, Gender, IUserFilters} from "../../../shared/models/IUser";
import {FormControl, FormGroup} from "@angular/forms";
import {ListStateSaveService} from "../../services/list-state-save.service";
import {IProject} from "../../../shared/models/IProject";
import {ProjectsToken} from "../../../shared/services/fb-db.service";

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFiltersComponent implements OnInit, OnDestroy{

  public initialFilters!: IUserFilters;

  public filtersGroup = new FormGroup({
    name: new FormControl(""),
    salaryFrom: new FormControl(1000),
    salaryTo: new FormControl(1000000),
    companyPosition: new FormControl(CompanyPosition.Undefined),
    gender: new FormControl(Gender.Undefined),
    projectName: new FormControl("Любой"),
    fired: new FormControl(false)
  });

  @Input() public savedFilters?: IUserFilters;
  @Output() public filters$ = new EventEmitter<IUserFilters>();
  public projects$: Observable<IProject[]> = inject(ProjectsToken);

  private destroy$ = new Subject<boolean>();

  constructor(
    private listStateS: ListStateSaveService
  ) {}

  public ngOnInit(): void {
    this.initialFilters = JSON.parse(JSON.stringify(this.filtersGroup.value));
    const listStateFilters = this.listStateS.getState()?.filters
    if(listStateFilters){
      this.filtersGroup.setValue(listStateFilters);
      this.filters$.next(listStateFilters);
      this.listStateS.resetState();
    }
    else if(this.savedFilters)
      this.filtersGroup.setValue(this.savedFilters);
    else
      this.filters$.next(this.filtersGroup.value as IUserFilters)
    this.filtersGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(150)
      )
      .subscribe(v => this.filters$.next(v as IUserFilters));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public resetFilters(){
    this.filtersGroup.setValue(this.initialFilters);
    this.filters$?.next(this.filtersGroup.value as IUserFilters);
  }

  public filtersAreSet() {
    return JSON.stringify(this.filtersGroup.value) !== JSON.stringify(this.initialFilters);
  }
}
