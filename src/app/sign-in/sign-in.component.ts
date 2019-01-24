import { Component, OnInit } from '@angular/core';
import {AuthService, GoogleLoginProvider} from 'angular-6-social-login';
import {EmployeeService} from '../shared-components/providers/employee.service';
import {AppUserModel} from '../shared-components/models/shared-models/app-user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  employeeSession: AppUserModel;
  empId: string;
  signingIn: boolean;

  constructor(
    private getStatus: EmployeeService,
    private socialAuthService: AuthService,
    private signin: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getStatuss();
  }

  // verify if it's authenticated
  getStatuss() {
    this.getStatus.getAppStatus(localStorage.getItem('EmpAuthToken')).subscribe(
      () => {
        this.router.navigate(['hr']);
      },
      () => {
        localStorage.removeItem('EmpAuthToken');
        localStorage.removeItem('EmpFullName');
        localStorage.removeItem('EmpLang');
        localStorage.removeItem('EmpAvatarImg');
        localStorage.removeItem('EmpAccess');
        this.router.navigate(['sign-in']);
      });
  }

  // sign-in with google
  public socialSignIn() {
    // toggle signing-in spinner
    this.signingIn = !(this.signingIn);

    // get auth token with google sign-in
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (userData) => {
        // subscribe to google sign-in service
        this.signin.signInWithGoogle(userData.idToken).subscribe(
          (user) => {

            // get session data
            this.employeeSession = user.json().body.data;
            this.empId = user.json().body.data.userAttributes.HR_MODULES__APP.attributeValue;
            // clear previews localStorage
            localStorage.removeItem('EmpAuthToken');
            localStorage.removeItem('EmpId');
            localStorage.removeItem('EmpFullName');
            localStorage.removeItem('EmpLang');
            localStorage.removeItem('EmpAvatarImg');
            localStorage.removeItem('EmpAccess');

            // insert to localStorage new session data
            setTimeout(() => {

              // new session data
              localStorage.setItem('EmpAuthToken', this.employeeSession.authToken);
              localStorage.setItem('EmpId', this.empId);
              localStorage.setItem('EmpFullName', this.employeeSession.fullName);
              localStorage.setItem('EmpLang', this.employeeSession.lang);
              localStorage.setItem('EmpAvatarImg', this.employeeSession.pictureSrc);
              localStorage.setItem('EmpAccess', this.employeeSession.userAccessLevel.toString());
            }, 1000);

            // navigate to desired location
            setTimeout(() => {
              this.router.navigate(['hr']);
            }, 1000);
          }
        );
      }
    );
  }
}
