import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeService} from '../../shared-components/providers/employee.service';
import {RequestsService} from '../../shared-components/providers/requests.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  avatar: string;
  requestsType: boolean;
  badge: number;

  constructor(
    private empserve: EmployeeService,
    private reqServe: RequestsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getRequestsBadge();
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
  getRequestsBadge() {
    this.reqServe.getRequestsList(1, 1, 'pendingMe').subscribe((badge) => {
      this.badge = badge.json().body.data.totalRecords;
    });
  }
  openEmp() {
    this.requestsType = false;
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
    this.router.navigate([localStorage.getItem('EmpId'), 'requests'], {relativeTo: this.route, queryParams: {type: type}});
  }
  openHr() {
    this.requestsType = false;
    this.router.navigate(['request-management'], {relativeTo: this.route});
  }
  logout() {
    this.empserve.logoutApp(localStorage.getItem('EmpAuthToken')).subscribe(
      () => {
        localStorage.removeItem('EmpAuthToken');
        localStorage.removeItem('EmpId');
        localStorage.removeItem('EmpFullName');
        localStorage.removeItem('EmpLang');
        localStorage.removeItem('EmpAvatarImg');
        localStorage.removeItem('EmpAccess');
        this.router.navigate(['sign-in']);
      },
      () => {
        localStorage.removeItem('EmpAuthToken');
        localStorage.removeItem('EmpId');
        localStorage.removeItem('EmpFullName');
        localStorage.removeItem('EmpLang');
        localStorage.removeItem('EmpAvatarImg');
        localStorage.removeItem('EmpAccess');
        this.router.navigate(['sign-in']);
      }
    );
  }
}
