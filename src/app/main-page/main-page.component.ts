import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {EmployeeService} from '../shared-components/providers/employee.service';
import {Router} from '@angular/router';
import {HrPermission} from '../shared-components/permissions/hr-permission';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  @ViewChild('menu') menu: MatSidenav;
  sideNav = 'close';
  @Output() searching: EventEmitter<string> = new EventEmitter();
  search: string;
  avatar: string;

  constructor(public permissions: HrPermission, private status: EmployeeService, private router: Router) {}

  ngOnInit() {
    this.getStatus();
  }

  getStatus() {
    this.status.getAppStatus(localStorage.getItem('EmpAuthToken')).subscribe(
      (response) => {
        if (response.json().status.code === 'STATUS_OK') {
          this.permissions.hrAllRequest = response.json().body.data.appPermissions['hr/allRequests'];
          this.permissions.hrEmployee = response.json().body.data.appPermissions['hr/employee'];
          this.permissions.hrRequests = response.json().body.data.appPermissions['hr/employee/:empId/requests'];
          this.permissions.hrRequestsType = response.json().body.data.appPermissions['hr/employee/:empId/requests/type/:type'];
        } else {
          localStorage.removeItem('EmpAuthToken');
          localStorage.removeItem('EmpId');
          localStorage.removeItem('EmpFullName');
          localStorage.removeItem('EmpLang');
          localStorage.removeItem('EmpAvatarImg');
          this.router.navigate(['sign-in']);
        }
      },
      (error) => {
        localStorage.removeItem('EmpAuthToken');
        localStorage.removeItem('EmpId');
        localStorage.removeItem('EmpFullName');
        localStorage.removeItem('EmpLang');
        localStorage.removeItem('EmpAvatarImg');
        this.router.navigate(['sign-in']);
      }
    );
  }

  iconToggle() {
    this.sideNav = 'open';
    this.menu.toggle();
  }
  backing(firedEvent?: boolean) {
    if (this.sideNav === 'open' || firedEvent === true) {
      this.sideNav = 'close';
      this.menu.toggle();
    }
  }

  setCreds(type: string) {
    if (type === 'office') {
      return 'CED';
    } else {
      return localStorage.getItem('EmpFullName');
    }
  }

  avatarOrPic() {
    if (localStorage.getItem('EmpAvatarImg').length > 0) {
      this.avatar = localStorage.getItem('EmpAvatarImg');
      return true;
    }
  }

  searchingFunc() {
    this.searching.emit(this.search);
  }
}
