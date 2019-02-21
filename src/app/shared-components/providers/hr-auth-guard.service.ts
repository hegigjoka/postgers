import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {HrPermission} from '../permissions/hr-permission';

@Injectable()
export class HrAuthGuardService implements CanActivate {
  constructor(public router: Router, public permissions: HrPermission) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.permissions.hrAllRequest.allowList !== true) {
      this.router.navigate(['/']);
    } else {
      return true;
    }
  }
}
