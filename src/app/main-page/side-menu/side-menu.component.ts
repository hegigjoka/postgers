import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeService} from '../../shared-components/providers/employee.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  avatar: string;
  requestsType: boolean;

  constructor(private empserve: EmployeeService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  avatarOrPic() {
    if (localStorage.getItem('EmpAvatarImg').length > 0) {
      this.avatar = localStorage.getItem('EmpAvatarImg');
      return true;
    }
  }
  openEmp() {
    this.router.navigate(['employees'], {relativeTo: this.route});
  }
  openReq() {
    this.requestsType = !(this.requestsType);
  }
  openReqType(type: string) {
    this.router.navigate([localStorage.getItem('EmpId'), 'requests'], {relativeTo: this.route, queryParams: {type: type}});
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
