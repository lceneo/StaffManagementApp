import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isChecked: boolean = false;
  mode: string = 'nightlight_round';
  title = 'staff-management';

  changed(event: MatSlideToggleChange): void{
    this.mode = !event.checked ? 'nightlight_round' : 'light_mode' ;
    document.body.classList.toggle('darkMode');
  }
}
