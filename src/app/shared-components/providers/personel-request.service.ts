import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {HrPermission} from '../permissions/hr-permission';

@Injectable()
export class PersonelRequestService {
  url = 'svc/hr/allRequests';

  constructor(public permissions: HrPermission, private http: Http) {}

  getOptions() {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });

    return this.http.options(`${this.url}`, {headers: header});
  }

  getPersonelRequests(pageNo: number, pageSize: number, processed: string, subDate?: string, date?: string, empId?: string, reqType?: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    let filter = `paramBean={pageNo:${pageNo},pageSize:${pageSize},authorizationId:'POOL00000000041',processedId:'${processed}',substitutionDatesInt:${subDate},validationDate:{min:'${date ? date.split('|')[0] : ''}',max'${date ? date.split('|')[1] : ''}'},employeeId:'${empId}',requestTypeId:'${reqType}',fillFieldLabels:true}`;
    if (subDate === '' ) {
      filter = filter.split(/,substitutionDatesInt:/)[0] + filter.split(/,substitutionDatesInt:/)[1];
    }
    if (date === '|' ) {
      filter = filter.split(/,validationDate:{min:'',max''}/)[0] + filter.split(/,validationDate:{min:'',max''}/)[1];
    }
    if (empId === '') {
      filter = filter.split(/,employeeId:''/)[0] + filter.split(/,employeeId:''/)[1];
    }
    if (reqType === '') {
      filter = filter.split(/,requestTypeId:''/)[0] + filter.split(/,requestTypeId:''/)[1];
    }

    return this.http.get(`${this.url}?${filter}`, {headers: header});
  }

  patchPersonelRequests(reqId: string, reqType: string, procId: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang'),
      'Content-Type': 'application/json'
    });
    const empId = this.permissions.employee.id;
    return this.http.patch(`svc/hr/employee/${empId}/requests/type/${reqType}/${reqId}/partial/processedId`, {processedId: procId}, {headers: header});
  }
}
