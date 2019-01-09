import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {EmployeeInsertUpdateModel} from '../models/Employee-Models/employee-insert-update.model';

@Injectable()
export class EmployeeService {
  // Paths
  signIn = 'svc/hr/auth/gaLogin';
  status = 'svc/hr/auth/status?appId=HR_MODULES__APP';
  logout = 'svc/hr/auth/logout';
  employee = 'svc/hr/employee';

  // Headers
  statusAuthHeader = new Headers({'Authorization': localStorage.getItem('EmpAuthToken')});
  providersAuthHeader = new Headers({
    'Authorization': 'APPUSER00000005',
    'Accept': 'application/json',
    'Accept-Language': 'en',
  });
  providerAuthHeaderExtra = new Headers({
    'Authorization': 'APPUSER00000005',
    'Accept': 'application/json',
    'Accept-Language': 'en',
    'Content-Type': 'application/json'
  });

  constructor(private empServe: Http) {}

  // Signing-in Providers
  getAppStatus() {
    return this.empServe.get(this.status, {headers: this.statusAuthHeader});
  }
  signInWithGoogle(token: string) {
    return this.empServe.post(this.signIn, {googleTokenId: token});
  }
  logoutApp() {
    return this.empServe.delete(this.logout, {headers: this.statusAuthHeader});
  }

  // Getting labels provider
  getFieldMapEmployee() {
    return this.empServe.options(this.employee, {headers: this.providersAuthHeader});
  }

  // Employee CRUD provider
  // --------------------------------------------------------------------------------------------------------------------
  // Create
  insertEmployee(emp: EmployeeInsertUpdateModel) {
    return this.empServe.post(this.employee + '/new', {
      firstName: emp.firstName,
      lastName: emp.lastName,
      birthdate: emp.birthdate,
      managerId: emp.managerId,
      directorId: emp.directorId,
      email: emp.email,
      officeNameId: emp.officeNameId
    }, {headers: this.providerAuthHeaderExtra});
  }
  // Retrieve single
  getEmployee(empId: string) {
    return this.empServe.get(this.employee + '/' + empId, {headers: this.providersAuthHeader});
  }
  // Retrieve list
  getEmployeeList(paginate: number, pagesize?: number, firstName?: string) {
    const filters  = {
      pageNo: paginate,
      pageSize: pagesize ? pagesize : '12',
      firstName: firstName ? firstName : ''
    };
    return this.empServe.get(this.employee, {params: {filters: filters}, headers: this.providersAuthHeader});
  }
  // Update
  updateEmployee(empId: string, emp: EmployeeInsertUpdateModel) {
    return this.empServe.put(this.employee + '/' + empId, {
      id: empId,
      firstName: emp.firstName,
      lastName: emp.lastName,
      birthdate: emp.birthdate,
      managerId: emp.managerId,
      directorId: emp.directorId,
      email: emp.email,
      officeNameId: emp.officeNameId
    }, {headers: this.providerAuthHeaderExtra});
  }
  // Delete
  deleteEmployee(empId: string) {
    return this.empServe.delete(this.employee + '/' + empId, {headers: this.providersAuthHeader});
  }
}
