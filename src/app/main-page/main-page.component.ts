import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {EmployeeService} from '../shared-components/providers/employee.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  @ViewChild('menu') menu: MatSidenav;
  @Output() searching: EventEmitter<string> = new EventEmitter();
  search: string;
  x: boolean;
  icon = 'menu';
  iconToggler: boolean;
  avatar: string;

  constructor(private status: EmployeeService, private router: Router) {}

  ngOnInit() {
    this.getStatus();
  }

  getStatus() {
    this.status.getAppStatus(localStorage.getItem('EmpAuthToken')).subscribe(
      () => {},
      (error) => {
        localStorage.removeItem('EmpAuthToken');
        localStorage.removeItem('EmpFullName');
        localStorage.removeItem('EmpAvatarImg');
        localStorage.removeItem('EmpAccess');
        this.router.navigate(['sign-in']);
      }
    );
  }

  iconToggle() {
    this.x = !(this.x);
    this.iconToggler = !(this.iconToggler);
    this.menu.toggle();
    setTimeout(() => {
      if (this.iconToggler === false) {
        this.icon = 'menu';
        console.log('side-menu is closed');
      } else {
        this.icon = 'close';
        console.log('side-menu is opened');
      }
    }, 300);
  }

  avatarOrPic() {
    if (localStorage.getItem('EmpAvatarImg').length > 0) {
      this.avatar = localStorage.getItem('EmpAvatarImg');
      return true;
    }
  }

  searcingFunc() {
    this.searching.emit(this.search);
  }
}
