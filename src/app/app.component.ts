import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {IAuthService, IAuthServiceToken} from "./shared/interfaces/IAuthService";
import {NavigationStart, Router} from "@angular/router";
import {BehaviorSubject, filter, map, tap} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  public isChecked: boolean = false;
  public mode: string = 'light_mode';
  public title = 'staff-management';
  public activatedUrl$ = new BehaviorSubject<string>(this.router.url);

  constructor(
    @Inject(IAuthServiceToken)
    private authS: IAuthService,
    private router: Router
  ) {}


  public ngOnInit(): void {
   this.initTheme();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        map(event => (event as NavigationStart).url)
      )
      .subscribe(
        url => this.activatedUrl$.next(url)
      );
  }

  private initTheme(){
    const lastSavedTheme = localStorage.getItem("$saved_theme");
    if(lastSavedTheme && lastSavedTheme === "nightlight_round"){
      this.mode = lastSavedTheme;
      this.isChecked = true;
      document.body.classList.toggle('darkMode');
    }
  }

  public exitFromAccount(){
    this.authS.signOut();
    this.router.navigate(["login"]);
  }

  public changed(event: MatSlideToggleChange): void{
    this.mode = event.checked ? 'nightlight_round' : 'light_mode' ;
    document.body.classList.toggle('darkMode');
    localStorage.setItem("$saved_theme", this.mode);
  }
}
