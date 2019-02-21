import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeService} from '../../shared-components/providers/employee.service';
import {RequestsService} from '../../shared-components/providers/requests.service';
import {HrPermission} from '../../shared-components/permissions/hr-permission';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  avatar: string;
  requestsType: boolean;
  languageType: boolean;
  badge: number;
  @Output() fireEvent: EventEmitter<boolean> = new EventEmitter();
  allowEmployee: boolean;
  allowRequests: boolean;
  allowHrOffice: boolean;

  constructor(
    public translate: TranslateService,
    private empserve: EmployeeService,
    private reqServe: RequestsService,
    private router: Router,
    private route: ActivatedRoute,
    public permissions: HrPermission
  ) { }

  ngOnInit() {
    setTimeout(() => {
      if (this.permissions.hrEmployee.allowList === true) {
        this.allowEmployee = true;
      }
      if (this.permissions.hrRequests.allowList === true) {
        this.allowRequests = true;
      }
      if (this.permissions.hrAllRequest.allowList === true) {
        this.allowHrOffice = true;
      }
      this.getRequestsBadge();
    }, 600);
  }

  setCreds(type: string) {
    if (type === 'office') {
      return 'CED';
    } else {
      return this.permissions.employee.fullName;
    }
  }
  avatarOrPic() {
    if (this.permissions.employee.img.length > 0 && this.permissions.employee.img !== '') {
      this.avatar = this.permissions.employee.img;
      return true;
    }
  }
  getRequestsBadge() {
    this.reqServe.getRequestsList(1, 1, 'pendingMe').subscribe((badge) => {
      this.badge = badge.json().body.data.totalRecords;
    });
  }
  openEmp() {
    this.requestsType = false;
    this.fireEvent.emit(true);
    this.router.navigate(['employees'], {relativeTo: this.route});
  }
  openReq() {
    this.getRequestsBadge();
    this.requestsType = !(this.requestsType);
  }
  openReqType(type: string) {
    if (type === 'pendingMe'){
      this.requestsType = false;
    }
    this.fireEvent.emit(true);
    this.router.navigate([this.permissions.employee.id, 'requests'], {relativeTo: this.route, queryParams: {type: type}});
  }
  openHr() {
    this.requestsType = false;
    this.fireEvent.emit(true);
    this.router.navigate(['request-management'], {relativeTo: this.route});
  }
  openCalendar() {
    this.requestsType = false;
    this.fireEvent.emit(true);
    window.open('https://calendar.google.com', '_blank');
  }
  openLang() {
    this.requestsType = false;
    this.languageType = !(this.languageType);
  }
  openLangType(lang: string) {
    this.requestsType = false;
    this.translate.use(lang);
    localStorage.setItem('EmpLang', lang);
    if (this.route.snapshot['_routerState'].url.match(/hr\//)) {
      this.fireEvent.emit(true);
    }
  }
  logout() {
    this.empserve.logoutApp(localStorage.getItem('EmpAuthToken')).subscribe(
      () => {
        localStorage.removeItem('EmpAuthToken');
        this.router.navigate(['sign-in']);
      },
      () => {
        localStorage.removeItem('EmpAuthToken');
        this.router.navigate(['sign-in']);
      }
    );
  }
}
