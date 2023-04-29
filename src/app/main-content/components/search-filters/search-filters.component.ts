import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, debounceTime, Subject, takeUntil} from "rxjs";
import {Gender, IUserFilters} from "../../../shared/models/IUser";
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
    companyPosition: new FormControl(""),
    gender: new FormControl(Gender.Undefined),
    projectName: new FormControl("")
  });

  @Output() public filters$ = new BehaviorSubject<IUserFilters>(JSON.parse(JSON.stringify(this.filtersGroup.value)));
  private destroy$ = new Subject<boolean>();

  ngOnInit(): void {
    this.initialFilters = JSON.parse(JSON.stringify(this.filtersGroup.value));
    this.filtersGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(150)
      )
      .subscribe(v => this.filters$.next(v as IUserFilters));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public resetFilters(){
    this.filtersGroup.setValue(this.initialFilters);
    this.filters$?.next(this.filtersGroup.value as IUserFilters);
  }

  public filtersAreSet() {
    return JSON.stringify(this.filtersGroup.value) !== JSON.stringify(this.initialFilters);
  }
}
