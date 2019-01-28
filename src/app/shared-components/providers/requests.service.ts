import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {RequestExtraHoursModel} from '../models/requests-models/request-extra-hours.model';

@Injectable()
export class RequestsService {
  // PATHS----------------------------------------------------------------------------------------------------------------------------------
  urlPath = 'svc/hr/employee/';

  // HEADERS--------------------------------------------------------------------------------------------------------------------------------
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
  // ---------------------------------------------------------------------------------------------------------------------------------------

  constructor(private http: Http) {}

  getTableOptions(type?: string) {
    if (type === 'extraHours') {
      return this.http.options(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/extraHours`,
        {headers: this.providersAuthHeader});
    }
    return this.http.options(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests`,
      {headers: this.providersAuthHeader});
  }
  getRequestsList(pageNo: number, pageSize: number, type?: string) {
    let filter = 'paramBean={pageNo:' + pageNo + ',pageSize:' + pageSize + ',type:"' + type + '",fillFieldLabels:true}';
    if (type === undefined) {
      filter = filter.split(/,type:"undefined"/)[0] + filter.split(/,type:"undefined"/)[1];
    } else if (filter.length === 0) {
      filter = filter.split(/,type:""/)[0] + filter.split(/,type:""/)[1];
    }
    return this.http.get(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests?${filter}`,
      {headers: this.providersAuthHeader});
  }

  // EXTRA_HOURS----------------------------------------------------------------------------------------------------------------------------

  // get extra hours single request
  getExtraHoursRequest(reqId: string) {
    const filter = 'paramBean={fillFieldLabels:true}';
    return this.http.get(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/extraHours/${reqId}?${filter}`,
      {headers: this.providersAuthHeader});
  }

  // insert new extra hours request
  insertExtraHoursRequest(xHRequest?: RequestExtraHoursModel) {
    return this.http.post(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/extraHours/new`,
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

  // manage extra hours request (approve/deny/authorize/not authorize)
  managerNdirectorDecisionExtraHoursRequest(type: string, reqId: string, notes: string, authType?: string) {
    if (type === 'approve') {
      return this.http.put(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/extraHours/${reqId}`,
        {
          id: reqId,
          approvementId: 'POOL00000000044',
          managerNotes: notes
        },
        {headers: this.providerAuthHeaderExtra}
      );
    } else if (type === 'deny') {
      return this.http.put(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/extraHours/${reqId}`,
        {
          id: reqId,
          approvementId: 'POOL00000000045',
          managerNotes: notes
        },
        {headers: this.providerAuthHeaderExtra}
      );
    } else if (type === 'authorize') {
      return this.http.put(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/extraHours/${reqId}`,
        {
          id: reqId,
          authorizationId: 'POOL00000000041',
          authorizationTypeId: authType,
          directorNotes: notes
        },
        {headers: this.providerAuthHeaderExtra}
      );
    } else {
      return this.http.put(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/extraHours/${reqId}`,
        {
          id: reqId,
          authorizationId: 'POOL00000000042',
          authorizationTypeId: 'POOL00000000047',
          directorNotes: notes
        },
        {headers: this.providerAuthHeaderExtra}
      );
    }
  }

  // delete extra hours request
  deleteExtraHoursRequest(reqId: string) {
    return this.http.delete(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/extraHours/${reqId}`,
      {headers: this.providersAuthHeader});
  }
}
