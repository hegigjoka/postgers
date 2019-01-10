import {Component, OnInit} from '@angular/core';
import {EmployeeService} from './shared-components/providers/employee.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private getStatus: EmployeeService, private router: Router) {}

  ngOnInit() {
    this.getStatuss();
  }

  getStatuss() {
    this.getStatus.getAppStatus(localStorage.getItem('EmpAuthToken')).subscribe(
      () => {
        this.router.navigate(['hr']);
      },
    () => {
      localStorage.removeItem('EmpAuthToken');
      localStorage.removeItem('EmpFullName');
      localStorage.removeItem('EmpAvatarImg');
      localStorage.removeItem('EmpAccess');
      this.router.navigate(['sign-in']);
    });
  }
}
