import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {EmployeeService} from './employee.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  authToken: string;

  constructor(private empServe: EmployeeService,public router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.authToken = localStorage.getItem('EmpAuthToken');
    if (!this.authToken) {
      this.router.navigate(['sign-in']);
      return false;
    } else {
      return true;
    }
  }
}
