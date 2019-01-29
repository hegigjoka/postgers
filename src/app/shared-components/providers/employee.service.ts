import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {EmployeeModel} from '../models/employee-models/employee.model';

@Injectable()
export class EmployeeService {
  // Paths
  signIn = 'svc/hr/auth/gaLogin';
  status = 'svc/hr/auth/status?appId=HR_MODULES__APP';
  logout = 'svc/hr/auth/logout';
  employee = 'svc/hr/employee';

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
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    return this.empServe.options(this.employee, {headers: header});
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
  // Employee CRUD provider
  // ---------------------------------------------------------------------------------------------------------------------------------------
  // Create
  insertEmployee(emp: EmployeeModel) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang'),
      'Content-Type': 'application/json'
    });
    return this.empServe.post(this.employee + '/new', {
      firstName: emp.firstName,
      lastName: emp.lastName,
      birthdate: emp.birthdate,
      managerId: emp.managerId,
      directorId: emp.directorId,
      email: emp.email,
      officeNameId: emp.officeNameId
    }, {headers: header});
  }
  // Retrieve single
  getEmployee(empId: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    return this.empServe.get(this.employee + '/' + empId, {headers: header});
  }

  // Retrieve list
  getEmployeeList(
    paginate: number,
    pagesize?: number,
    firstName?: string,
    officeNameId?: string,
    managerId?: string,
    directorId?: string
    ) {
    // const paramBean  = {
    //   pageNo: paginate,
    //   pageSize: pagesize,
    //   firstName: firstName,
    //   lastName: lastName,
    //   officeNameId: officeNameId,
    //   managerId: managerId,
    //   directorId: directorId
    // };
    // return this.empServe.get(this.employee, {params: {filters: paramBean}, headers: this.providersAuthHeader});

    // Headers
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });

    // filters
    let paramBean = '?paramBean={pageNo:' + paginate + ',pageSize:' + pagesize + ',firstName="' + firstName + '",officeNameId="'
      + officeNameId + '",managerId="' + managerId + '",directorId="' + directorId + '"}';

    // statements for filter management
    if (firstName === undefined) {
      paramBean = paramBean.split(/,firstName="undefined"/)[0] + paramBean.split(/,firstName="undefined"/)[1];
    } else if (firstName.length === 0) {
      paramBean = paramBean.split(/,firstName=""/)[0] + paramBean.split(/,firstName=""/)[1];
    }
    if (officeNameId === undefined) {
      paramBean = paramBean.split(/,officeNameId="undefined/)[0] + paramBean.split(/,officeNameId="undefined"/)[1];
    } else if (officeNameId.length === 0) {
      paramBean = paramBean.split(/,officeNameId=""/)[0] + paramBean.split(/,officeNameId=""/)[1];
    }
    if (managerId === undefined) {
      paramBean = paramBean.split(/,managerId="undefined"/)[0] + paramBean.split(/,managerId="undefined"/)[1];
    } else if (managerId.length === 0) {
      paramBean = paramBean.split(/,managerId=""/)[0] + paramBean.split(/,managerId=""/)[1];
    }
    if (directorId === undefined) {
      paramBean = paramBean.split(/,directorId="undefined"/)[0] + paramBean.split(/,directorId="undefined"/)[1];
    } else if (directorId.length === 0) {
      paramBean = paramBean.split(/,directorId=""/)[0] + paramBean.split(/,directorId=""/)[1];
    }

    // get employee list service
    return this.empServe.get(
        this.employee + paramBean,
        {headers: header});
  }


  // Update
  updateEmployee(empId: string, emp: EmployeeModel) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang'),
      'Content-Type': 'application/json'
    });
    return this.empServe.put(this.employee + '/' + empId, {
      id: empId,
      firstName: emp.firstName,
      lastName: emp.lastName,
      birthdate: emp.birthdate,
      managerId: emp.managerId,
      directorId: emp.directorId,
      email: emp.email,
      officeNameId: emp.officeNameId
    }, {headers: header});
  }
  // Delete
  deleteEmployee(empId: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    return this.empServe.delete(this.employee + '/' + empId, {headers: header});
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
