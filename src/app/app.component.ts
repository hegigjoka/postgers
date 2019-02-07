import {Component, OnInit} from '@angular/core';
import {EmployeeService} from './shared-components/providers/employee.service';
import {Router} from '@angular/router';
import {HrPermission} from './shared-components/permissions/hr-permission';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public permissions: HrPermission, private getStatus: EmployeeService, private router: Router) {}

  ngOnInit() {
    this.getStatuss();
  }

  getStatuss() {
    this.getStatus.getAppStatus(localStorage.getItem('EmpAuthToken')).subscribe(
      (response) => {
        if (response.json().status.code === 'STATUS_OK') {
          this.permissions.hrAllRequest = response.json().body.data.appPermissions['hr/allRequests'];
          this.permissions.hrEmployee = response.json().body.data.appPermissions['hr/employee'];
          this.permissions.hrRequests = response.json().body.data.appPermissions['hr/employee/:empId/requests'];
          this.permissions.hrRequestsType = response.json().body.data.appPermissions['hr/employee/:empId/requests/type/:type'];
          this.router.navigate(['hr']);
        } else {
          localStorage.removeItem('EmpAuthToken');
          localStorage.removeItem('EmpId');
          localStorage.removeItem('EmpFullName');
          localStorage.removeItem('EmpLang');
          localStorage.removeItem('EmpAvatarImg');
          this.router.navigate(['sign-in']);
        }
      },
    () => {
      localStorage.removeItem('EmpAuthToken');
      localStorage.removeItem('EmpId');
      localStorage.removeItem('EmpFullName');
      localStorage.removeItem('EmpLang');
      localStorage.removeItem('EmpAvatarImg');
      this.router.navigate(['sign-in']);
    });
  }
}
