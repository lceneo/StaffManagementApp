import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  isChecked = false;
  mode = 'nightlight_round';
  title = 'staff-management';
  selected = 'ru';

  changed(event: MatSlideToggleChange): void {
    this.mode = !event.checked ? 'nightlight_round' : 'light_mode';
    document.body.classList.toggle('darkMode');
  }

  constructor(private translate: TranslateService) { }
  ngOnInit(): void {
    this.translate.addLangs(['en', 'ru']);
    this.translate.setDefaultLang('ru');
    this.translate.use('ru');

  }

  selectLanguage(event: any) {
    this.translate.use(event.value);
  }
}
