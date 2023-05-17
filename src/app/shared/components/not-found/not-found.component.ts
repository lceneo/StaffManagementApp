import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, interval, take, timeout} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent implements OnInit{
  public isLoading$ = new BehaviorSubject<boolean>(true);

  constructor(private router: Router) {}

  public ngOnInit(): void {
    this.dissolveLoadingEffect(250)
      .subscribe(() => this.isLoading$.next(false));
  }

  public dissolveLoadingEffect(time: number){
    return interval(time)
      .pipe(
        take(1)
      );
  }

  public navigateToMainPage(){
    this.isLoading$.next(true);
    this.dissolveLoadingEffect(250)
      .subscribe(() => this.router.navigate([""]));
  }
}
