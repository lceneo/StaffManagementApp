import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, debounceTime, Subject, takeUntil} from "rxjs";
import {CompanyPosition, Gender, IUserFilters} from "../../../shared/models/IUser";
import {FormControl, FormGroup} from "@angular/forms";

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
    projectName: new FormControl(""),
    fired: new FormControl(false)
  });

  @Input() public savedFilters?: IUserFilters;
  @Output() public filters$ = new EventEmitter<IUserFilters>();

  private destroy$ = new Subject<boolean>();

  ngOnInit(): void {
    this.initialFilters = JSON.parse(JSON.stringify(this.filtersGroup.value));
    if(this.savedFilters){
      this.filtersGroup.setValue(this.savedFilters);
    }
    else{
      this.filters$.next(this.filtersGroup.value as IUserFilters)
    }
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
