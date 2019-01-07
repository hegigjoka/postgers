import { Component, OnInit } from '@angular/core';
import {AuthService, GoogleLoginProvider} from 'angular-6-social-login';
import {Response} from '@angular/http';
import {EmployeeService} from '../shared-components/providers/employee.service';
import {EmployeeSession} from '../shared-components/models/employee-session';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  employeeSession: EmployeeSession;

  constructor(private socialAuthService: AuthService, private signin: EmployeeService, private router: Router) {}

  ngOnInit() {}

  public socialSignIn() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (userData) => {
        this.signin.signInWithGoogle(userData.idToken).subscribe(
          (user: Response) => {
            this.employeeSession = user.json().body.data;
            localStorage.setItem('EmpAuthToken', this.employeeSession.authToken);
            localStorage.setItem('EmpFullName', this.employeeSession.fullName);
            localStorage.setItem('EmpAvatarImg', this.employeeSession.pictureSrc);
            localStorage.setItem('EmpAccess', this.employeeSession.userAccessLevel.toString());
            setTimeout(() => {
              this.router.navigate(['employee', this.employeeSession.id]);
            }, 1800);
          }
        );
      }
    );
  }
}
