import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuardService implements CanActivate {
  authToken: string;

  constructor(public router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.authToken = localStorage.getItem('EmpAuthToken');
    if (!this.authToken) {
      this.router.navigate(['sign-in']);
    } else {
      return true;
    }
  }
}
