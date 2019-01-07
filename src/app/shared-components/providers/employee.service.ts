import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class EmployeeService {
  empUrl = 'svc/hr/auth/gaLogin';

  constructor(private empServe: Http) {}

  signInWithGoogle(token: string) {
    return this.empServe.post(this.empUrl, {googleTokenId: token});
  }
}
