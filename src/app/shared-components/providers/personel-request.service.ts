import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

@Injectable()
export class PersonelRequestService {
  url = 'svc/hr/allRequests';

  constructor(private http: Http) {}

  getOptions() {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });

    return this.http.options(`${this.url}`, {headers: header});
  }

  getPersonelRequests(pageNo: number, pageSize: number, processed: string, date?: string, empId?: string, reqType?: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });

    let filter = '?paramBean={pageNo:' + pageNo + ',pageSize:' + pageSize + ',authorizationId:"POOL00000000041",processedId:"' + processed + '",authorizationDate:"' + date + '",employeeId:"' + empId + '",requestTypeId:"' + reqType + '",fillFieldLabels:true}';

    if (date === undefined) {
      filter = filter.split(/,authorizationDate:"undefined"/)[0] + filter.split(/,authorizationDate:"undefined"/)[1];
    } else if (date === '') {
      filter = filter.split(/,authorizationDate:""/)[0] + filter.split(/,authorizationDate:""/)[1];
    }
    if (empId === undefined) {
      filter = filter.split(/,employeeId:"undefined"/)[0] + filter.split(/,employeeId:"undefined"/)[1];
    } else if (empId === '') {
      filter = filter.split(/,employeeId:""/)[0] + filter.split(/,employeeId:""/)[1];
    }
    if (reqType === undefined) {
      filter = filter.split(/,requestTypeId:"undefined"/)[0] + filter.split(/,requestTypeId:"undefined"/)[1];
    } else if (reqType === '') {
      filter = filter.split(/,requestTypeId:""/)[0] + filter.split(/,requestTypeId:""/)[1];
    }

    return this.http.get(`${this.url}${filter}`, {headers: header});
  }

  patchPersonelRequests(reqId: string, procId: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang'),
      'Content-Type': 'application/json'
    });
    return this.http.patch(`${this.url}/${reqId}/partial/processedId`, {processedId: procId}, {headers: header});
  }
}
