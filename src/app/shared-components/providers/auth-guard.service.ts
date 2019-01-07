import { Injectable } from '@angular/core';
import {Router, CanActivate} from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {
  authToken: string;

  constructor( public router: Router) {}

  canActivate(): any {
    this.authToken = localStorage.getItem('EmpAuthToken');
    if (!this.authToken) {
      this.router.navigate(['sign-in']);
      return false;
    } else {
      return true;
    }
  }
}
