import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {RequestExtraHoursModel} from '../models/requests-models/request-extra-hours.model';
import {RequestHolidayModel} from '../models/requests-models/request-holiday.model';
import {RequestMissionModel} from '../models/requests-models/request-mission.model';
import {RequestMissingBadgeModel} from '../models/requests-models/request-missing-badge.model';

@Injectable()
export class RequestsService {
  // PATHS----------------------------------------------------------------------------------------------------------------------------------
  urlPath = 'svc/hr/employee/';
  // ---------------------------------------------------------------------------------------------------------------------------------------

  constructor(private http: Http) {}

  getTableOptions(type?: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    if (type === 'extraHours') {
      return this.http.options(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/extraHours`,
        {headers: header});
    } else if (type === 'holidays') {
      return this.http.options(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/holidays`,
        {headers: header});
    } else if (type === 'mission') {
      return this.http.options(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/missions`,
        {headers: header});
    } else if (type === 'missingBadge') {
      return this.http.options(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/missingBadge`,
        {headers: header});
    }
    return this.http.options(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests`,
      {headers: header});
  }

  getRequestsList(pageNo: number, pageSize: number, type?: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    let filter = 'paramBean={pageNo:' + pageNo + ',pageSize:' + pageSize + ',type:"' + type + '",fillFieldLabels:true}';
    if (type === undefined) {
      filter = filter.split(/,type:"undefined"/)[0] + filter.split(/,type:"undefined"/)[1];
    } else if (filter.length === 0) {
      filter = filter.split(/,type:""/)[0] + filter.split(/,type:""/)[1];
    }
    return this.http.get(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests?${filter}`,
      {headers: header});
  }

  // EXTRA_HOURS----------------------------------------------------------------------------------------------------------------------------

  // get extra hours single request
  getExtraHoursRequest(reqId: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    const filter = 'paramBean={fillFieldLabels:true}';
    return this.http.get(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/extraHours/${reqId}?${filter}`,
      {headers: header});
  }

  // insert new extra hours request
  insertExtraHoursRequest(xHRequest?: RequestExtraHoursModel) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang'),
      'Content-Type': 'application/json'
    });
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
      {headers: header});
  }

  // manage extra hours request (approve/deny/authorize/not authorize)
  managerNdirectorDecisionExtraHoursRequest(type: string, reqId: string, notes: string, authType?: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang'),
      'Content-Type': 'application/json'
    });
    if (type === 'approve') {
      return this.http.put(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/extraHours/${reqId}`,
        {
          id: reqId,
          approvementId: 'POOL00000000044',
          managerNotes: notes
        },
        {headers: header}
      );
    } else if (type === 'deny') {
      return this.http.put(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/extraHours/${reqId}`,
        {
          id: reqId,
          approvementId: 'POOL00000000045',
          managerNotes: notes
        },
        {headers: header}
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
        {headers: header}
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
        {headers: header}
      );
    }
  }

  // delete extra hours request
  deleteExtraHoursRequest(reqId: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    return this.http.delete(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/extraHours/${reqId}`,
      {headers: header});
  }

  // HOLIDAY-------------------------------------------------------------------------------------------------------------------------------

  // get holidays single request
  getHolidayRequest(reqId: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    const filter = 'paramBean={fillFieldLabels:true}';
    return this.http.get(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/holidays/${reqId}?${filter}`,
      {headers: header});
  }

  // insert new holiday request
  insertHolidaysRequest(hRequest?: RequestHolidayModel) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang'),
      'Content-Type': 'application/json'
    });
    return this.http.post(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/holidays/new`,
      {
        countHD: hRequest.countHD,
        employeeNotes: hRequest.employeeNotes,
        managerId: hRequest.managerId,
        directorId: hRequest.directorId,
        employeeId: hRequest.employeeId,
        officeNameId: hRequest.officeNameId,
        startTimestamp: hRequest.startTimestamp,
        stopTimestamp: hRequest.stopTimestamp,
        requestTypeId: 'POOL00000000079',
        holidayTypeId: hRequest.holidayTypeId
      },
      {headers: header});
  }

  // manage holidays request (approve/deny/authorize/not authorize)
  managerNdirectorDecisionHolidayRequest(type: string, reqId: string, notes: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang'),
      'Content-Type': 'application/json'
    });
    if (type === 'approve') {
      return this.http.put(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/holidays/${reqId}`,
        {
          id: reqId,
          approvementId: 'POOL00000000044',
          managerNotes: notes
        },
        {headers: header}
      );
    } else if (type === 'deny') {
      return this.http.put(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/holidays/${reqId}`,
        {
          id: reqId,
          approvementId: 'POOL00000000045',
          managerNotes: notes
        },
        {headers: header}
      );
    } else if (type === 'authorize') {
      return this.http.put(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/holidays/${reqId}`,
        {
          id: reqId,
          authorizationId: 'POOL00000000041',
          directorNotes: notes
        },
        {headers: header}
      );
    } else {
      return this.http.put(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/holidays/${reqId}`,
        {
          id: reqId,
          authorizationId: 'POOL00000000042',
          directorNotes: notes
        },
        {headers: header}
      );
    }
  }

  // delete holiday request
  deleteHolidayRequest(reqId: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    return this.http.delete(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/holidays/${reqId}`,
      {headers: header});
  }
  // MISSION--------------------------------------------------------------------------------------------------------------------------------

  // get mission single request
  getMissionRequest(reqId: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    const filter = 'paramBean={fillFieldLabels:true}';
    return this.http.get(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/missions/${reqId}?${filter}`,
      {headers: header});
  }

  // insert new mission request
  insertMissionRequest(hRequest?: RequestMissionModel) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang'),
      'Content-Type': 'application/json'
    });
    return this.http.post(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/missions/new`,
      {
        employeeNotes: hRequest.employeeNotes,
        managerId: hRequest.managerId,
        employeeId: hRequest.employeeId,
        officeNameId: hRequest.officeNameId,
        startTimestamp: hRequest.startTimestamp,
        stopTimestamp: hRequest.stopTimestamp,
        requestTypeId: 'POOL00000000078',
        missionTypeId: hRequest.missionTypeId,
        missionWhere: hRequest.missionWhere
      },
      {headers: header});
  }

  // manage mission request (approve/deny/authorize/not authorize)
  managerNdirectorDecisionMissionRequest(type: string, reqId: string, notes: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang'),
      'Content-Type': 'application/json'
    });
    if (type === 'approve') {
      return this.http.put(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/missions/${reqId}`,
        {
          id: reqId,
          approvementId: 'POOL00000000044',
          managerNotes: notes
        },
        {headers: header}
      );
    } else {
      return this.http.put(
        `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/missions/${reqId}`,
        {
          id: reqId,
          approvementId: 'POOL00000000045',
          managerNotes: notes
        },
        {headers: header}
      );
    }
  }

  // delete mission request
  deleteMissionRequest(reqId: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    return this.http.delete(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/holidays/${reqId}`,
      {headers: header});
  }
  // BADGE_FAILURE--------------------------------------------------------------------------------------------------------------------------

  // get missing badge single request
  getMissingBadgeRequest(reqId: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    const filter = 'paramBean={fillFieldLabels:true}';
    return this.http.get(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/missingBadge/${reqId}?${filter}`,
      {headers: header});
  }

  // insert new missing badge request
  insertMissingBadgeRequest(mBRequest?: RequestMissingBadgeModel) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang'),
      'Content-Type': 'application/json'
    });
    return this.http.post(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/missingBadge/new`,
      {
        employeeNotes: mBRequest.employeeNotes,
        employeeId: mBRequest.employeeId,
        officeNameId: mBRequest.officeNameId,
        managerId: mBRequest.managerId,
        startTimestamp: mBRequest.startTimestamp,
        stopTimestamp: mBRequest.stopTimestamp,
        requestTypeId: 'POOL00000000080',
        badgeFailTypeId: mBRequest.badgeFailTypeId
      },
      {headers: header});
  }

  // delete missing badge request
  deleteMissingBadgeRequest(reqId: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    return this.http.delete(
      `${this.urlPath}/${localStorage.getItem('EmpId')}/requests/type/missingBadge/${reqId}`,
      {headers: header});
  }
}
