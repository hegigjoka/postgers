import { Component, OnInit } from '@angular/core';
import {AuthService, GoogleLoginProvider} from 'angular-6-social-login';
import {EmployeeService} from '../../providers/employee.service';
import {AppUserModel} from '../../models/shared-models/app-user.model';
import {Router} from '@angular/router';
import {HrPermission} from '../../permissions/hr-permission';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  employeeSession: AppUserModel;
  signingIn: boolean;

  constructor(
    public permissions: HrPermission,
    private getStatus: EmployeeService,
    private socialAuthService: AuthService,
    private signin: EmployeeService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getStatuss();
  }

  // verify if it's authenticated
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
        localStorage.removeItem('EmpFullName');
        localStorage.removeItem('EmpLang');
        localStorage.removeItem('EmpAvatarImg');
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
            // clear previews localStorage
            localStorage.removeItem('EmpAuthToken');
            localStorage.removeItem('EmpId');
            localStorage.removeItem('EmpFullName');
            localStorage.removeItem('EmpLang');
            localStorage.removeItem('EmpAvatarImg');

            // insert to localStorage new session data
            setTimeout(() => {

              // new session data
              localStorage.setItem('EmpAuthToken', this.employeeSession.authToken);
              localStorage.setItem('EmpId', this.employeeSession.userAttributes.HR_MODULES__APP.attributeValue);
              localStorage.setItem('EmpFullName', this.employeeSession.fullName);
              localStorage.setItem('EmpLang', this.employeeSession.lang);
              localStorage.setItem('EmpAvatarImg', this.employeeSession.pictureSrc);
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
