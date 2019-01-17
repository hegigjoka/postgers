import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {EmployeeModel} from '../models/employee-models/employee.model';
// import {HttpParams} from '@angular/common/http';

@Injectable()
export class EmployeeService {
  // Paths
  signIn = 'svc/hr/auth/gaLogin';
  status = 'svc/hr/auth/status?appId=HR_MODULES__APP';
  logout = 'svc/hr/auth/logout';
  employee = 'svc/hr/employee';
  // ---------------------------------------------------------------------------------------------------------------------------------------
  // Headers
  // ---------------------------------------------------------------------------------------------------------------------------------------
  providersAuthHeader = new Headers({
    'Authorization': 'APPUSER00000005',
    'Accept': 'application/json',
    'Accept-Language': 'en'
  });
  providerAuthHeaderExtra = new Headers({
    'Authorization': 'APPUSER00000005',
    'Accept': 'application/json',
    'Accept-Language': 'en',
    'Content-Type': 'application/json'
  });
  // ---------------------------------------------------------------------------------------------------------------------------------------
  constructor(private empServe: Http) {}
  // ---------------------------------------------------------------------------------------------------------------------------------------
  // Signing-in Providers
  // ---------------------------------------------------------------------------------------------------------------------------------------
  getAppStatus(token: string) {
    const statusAuthHeader = new Headers({
      'Authorization': token
    });
    return this.empServe.get(this.status, {headers: statusAuthHeader});
  }
  signInWithGoogle(token: string) {
    return this.empServe.post(this.signIn, {googleTokenId: token});
  }
  logoutApp(token: string) {
    const statusAuthHeader = new Headers({
      'Authorization': token
    });
    return this.empServe.delete(this.logout, {headers: statusAuthHeader});
  }

  // Getting labels provider
  getFieldMapEmployee() {
    return this.empServe.options(this.employee, {headers: this.providersAuthHeader});
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
  // Employee CRUD provider
  // ---------------------------------------------------------------------------------------------------------------------------------------
  // Create
  insertEmployee(emp: EmployeeModel) {
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
    // const paramBean  = {
    //   pageNo: paginate,
    //   pageSize: pagesize,
    //   firstName: firstName
    // };
    // return this.empServe.get(this.employee, {params: {filters: paramBean}, headers: this.providersAuthHeader});
    if (firstName === undefined) {
      // return this.empServe.get(
      //   this.employee + '?paramBean={pageNo:' + paginate + ',pageSize:' + pagesize + '}',
      //   {headers: this.providersAuthHeader});
      firstName = '';
    }
    // else {
    //   return this.empServe.get(
    //     this.employee + '?paramBean={pageNo:' + paginate + ',pageSize:' + pagesize + ',firstName:"' + firstName + '"}',
    //     {headers: this.providersAuthHeader});
    // }
    return this.empServe.get(
        this.employee + '?paramBean={pageNo:' + paginate + ',pageSize:' + pagesize + ',firstName:"' + firstName + '"}',
        {headers: this.providersAuthHeader});
  }
  // Update
  updateEmployee(empId: string, emp: EmployeeModel) {
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
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
