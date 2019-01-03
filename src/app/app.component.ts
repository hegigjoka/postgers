import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('menu') menu: MatSidenav;
  x: boolean;
  icon = 'menu';
  iconToggler: boolean;

  constructor() {}

  ngOnInit() {}

  iconToggle() {
    this.x = !(this.x);
    this.iconToggler = !(this.iconToggler);
    this.menu.toggle();
    setTimeout(() => {
      if (this.iconToggler === false) {
        this.icon = 'menu';
      } else {
        this.icon = 'close';
      }
    }, 300);
  }
}
