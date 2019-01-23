import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

@Injectable()
export class RequestsService {
  // Employee Id
  empId = localStorage.getItem('EmpId');

  // Paths
  tableOptions = 'svc/hr/employee/' + this.empId + '/requests';

  // Headers
  providersAuthHeader = new Headers({
    'Authorization': 'APPUSER00000005',
    'Accept': 'application/json',
    'Accept-Language': localStorage.getItem('EmpLang')
  });

  constructor(private http: Http) {}

  getTableOptions() {
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
}
