import {Component, OnInit} from '@angular/core';
import {EmployeeService} from './shared-components/providers/employee.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HrPermission} from './shared-components/permissions/hr-permission';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    public permissions: HrPermission,
    private getStatus: EmployeeService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.getStatuss();
    this.switchLanguage(localStorage.getItem('EmpLang') ? localStorage.getItem('EmpLang') : 'en');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  getStatuss() {
    this.getStatus.getAppStatus(localStorage.getItem('EmpAuthToken')).subscribe(
      (response) => {
        if (response.json().status.code === 'STATUS_OK') {
          this.permissions.hrAllRequest = response.json().body.data.appPermissions['hr/allRequests'];
          this.permissions.hrEmployee = response.json().body.data.appPermissions['hr/employee'];
          this.permissions.hrRequests = response.json().body.data.appPermissions['hr/employee/:empId/requests'];
          this.permissions.hrRequestsType = response.json().body.data.appPermissions['hr/employee/:empId/requests/type/:type'];
          this.permissions.employee.id = response.json().body.data.userAttributes.HR_MODULES__APP.attributeValue;
          this.permissions.employee.fullName = response.json().body.data.fullName;
          this.permissions.employee.img = response.json().body.data.pictureSrc;
          if (this.route.snapshot['_routerState'].url.match(/sign-in/)) {
            this.router.navigate(['hr']);
          }
        } else {
          localStorage.removeItem('EmpAuthToken');
          this.router.navigate(['sign-in']);
        }
      },
    () => {
      localStorage.removeItem('EmpAuthToken');
      this.router.navigate(['sign-in']);
    });
  }
}
