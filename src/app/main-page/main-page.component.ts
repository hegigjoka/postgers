import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {EmployeeService} from '../shared-components/providers/employee.service';
import {Response} from '@angular/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  @ViewChild('menu') menu: MatSidenav;
  x: boolean;
  icon = 'menu';
  iconToggler: boolean;
  avatar: string;

  constructor(private status: EmployeeService, private router: Router) {}

  ngOnInit() {
    this.getStatus();
  }

  getStatus() {
    this.status.getAppStatus().subscribe((type: Response) => {
      if (type.statusText === 'Unauthorized') {
        this.status.logoutApp().subscribe(() => {
          this.router.navigate(['sign-in']);
        });
      }
    });
  }
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

  avatarOrPic() {
    if (localStorage.getItem('EmpAvatarImg').length > 0) {
      this.avatar = localStorage.getItem('EmpAvatarImg');
      return true;
    }
  }
}
