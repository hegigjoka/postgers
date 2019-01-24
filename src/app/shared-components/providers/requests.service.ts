import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {RequestExtraHoursModel} from '../models/requests-models/request-extra-hours.model';

@Injectable()
export class RequestsService {
  // Employee Id
  empId = localStorage.getItem('EmpId');

  // Paths
  tableOptions = 'svc/hr/employee/' + this.empId + '/requests';
  extrahoursOptions = this.tableOptions + '/type/extraHours';
  extrahoursSet = this.extrahoursOptions + '/new';
  extrahoursGet = this.extrahoursOptions + '/';

  // Headers
  providersAuthHeader = new Headers({
    'Authorization': 'APPUSER00000005',
    'Accept': 'application/json',
    'Accept-Language': localStorage.getItem('EmpLang')
  });
  providerAuthHeaderExtra = new Headers({
    'Authorization': 'APPUSER00000005',
    'Accept': 'application/json',
    'Accept-Language': localStorage.getItem('EmpLang'),
    'Content-Type': 'application/json'
  });

  constructor(private http: Http) {}

  getTableOptions(type?: string) {
    if (type === 'extraHours') {
      return this.http.options(this.extrahoursOptions, {headers: this.providersAuthHeader});
    }
    return this.http.options(this.tableOptions, {headers: this.providersAuthHeader});
  }
  getRequestsList(pageNo: number, pageSize: number, type?: string) {
    let filter = '?paramBean={pageNo:' + pageNo + ',pageSize:' + pageSize + ',type:"' + type + '",fillFieldLabels:true}';
    if (type === undefined) {
      filter = filter.split(/,type:"undefined"/)[0] + filter.split(/,type:"undefined"/)[1];
    } else if (filter.length === 0) {
      filter = filter.split(/,type:""/)[0] + filter.split(/,type:""/)[1];
    }
    return this.http.get(this.tableOptions + filter, {headers: this.providersAuthHeader});
  }
  getExtraHoursRequest(reqId: string) {
    const filter = '?paramBean={fillFieldLabels:true}';
    return this.http.get(this.extrahoursGet + reqId + filter, {headers: this.providersAuthHeader});
  }
  insertRequest(xHRequest?: RequestExtraHoursModel) {
    // if (type === 'xH') {
    //   return this.http.post(this.extrahoursSet,
    //     {
    //       countHD: xHRequest.countHD,
    //       employeeNotes: xHRequest.employeeNotes,
    //       managerId: xHRequest.managerId,
    //       directorId: xHRequest.directorId,
    //       employeeId: xHRequest.employeeId,
    //       officeNameId: xHRequest.officeNameId,
    //       startTimestamp: xHRequest.startTimestamp,
    //       stopTimestamp: xHRequest.stopTimestamp,
    //       requestTypeId: 'POOL00000000081'
    //     },
    //     {headers: this.providerAuthHeaderExtra});
    // }
    return this.http.post(this.extrahoursSet,
      {
        countHD: xHRequest.countHD,
        employeeNotes: xHRequest.employeeNotes,
        managerId: xHRequest.managerId,
        directorId: xHRequest.directorId,
        employeeId: xHRequest.employeeId,
        officeNameId: xHRequest.officeNameId,
        startTimestamp: xHRequest.startTimestamp,
        stopTimestamp: xHRequest.stopTimestamp,
        requestTypeId: 'POOL00000000081'
      },
      {headers: this.providerAuthHeaderExtra});
  }
}
