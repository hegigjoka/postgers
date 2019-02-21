import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {RequestExtraHoursModel} from '../models/requests-models/request-extra-hours.model';
import {RequestHolidayModel} from '../models/requests-models/request-holiday.model';
import {RequestMissionModel} from '../models/requests-models/request-mission.model';
import {RequestMissingBadgeModel} from '../models/requests-models/request-missing-badge.model';
import {RequestSubstituteModel} from '../models/requests-models/request-substitute.model';
import {HrPermission} from '../permissions/hr-permission';

@Injectable()
export class RequestsService {
  // PATHS----------------------------------------------------------------------------------------------------------------------------------
  urlPath = 'svc/hr/employee';

  constructor(public permissions: HrPermission, private http: Http) {}

  getTableOptions(type?: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    if (type === 'extraHours') {
      return this.http.options(
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/extraHours`,
        {headers: header});
    } else if (type === 'holidays') {
      return this.http.options(
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/holidays`,
        {headers: header});
    } else if (type === 'mission') {
      return this.http.options(
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/missions`,
        {headers: header});
    } else if (type === 'missingBadge') {
      return this.http.options(
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/missingBadge`,
        {headers: header});
    } else if (type === 'subHoly') {
      return this.http.options(
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/substitutions`,
        {headers: header});
    }
    return this.http.options(
      `${this.urlPath}/${this.permissions.employee.id}/requests`,
      {headers: header});
  }

  getRequestsList(pageNo: number, pageSize: number, type?: string, date?: string, reqType?: string, status?: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    let filter = `paramBean={pageNo:${pageNo},pageSize:${pageSize},validationDate:{min:'${date ? date.split('|')[0] : ''}',max:'${date ? date.split('|')[1] : ''}'},requestTypeId:'${reqType}',status:'${status}',type:'${type}',fillFieldLabels:true}`;
    if (date === '|' || date === '') {
      filter = filter.split(/,validationDate:{min:'',max:''}/)[0] + filter.split(/,validationDate:{min:'',max:''}/)[1];
    } else if (date === undefined) {
      filter = filter.split(/,validationDate:{min:'',max:''}/)[0] + filter.split(/,validationDate:{min:'',max:''}/)[1];
    }
    if (type === undefined) {
      filter = filter.split(/,type:'undefined'/)[0] + filter.split(/,type:'undefined'/)[1];
    } else if (type === '') {
      filter = filter.split(/,type:''/)[0] + filter.split(/,type:''/)[1];
    }
    if (reqType === undefined) {
      filter = filter.split(/,requestTypeId:'undefined'/)[0] + filter.split(/,requestTypeId:'undefined'/)[1];
    } else if (reqType === '') {
      filter = filter.split(/,requestTypeId:''/)[0] + filter.split(/,requestTypeId:''/)[1];
    }
    if (status === undefined) {
      filter = filter.split(/,status:'undefined'/)[0] + filter.split(/,status:'undefined'/)[1];
    } else if (status === '') {
      filter = filter.split(/,status:''/)[0] + filter.split(/,status:''/)[1];
    }
    return this.http.get(
      `${this.urlPath}/${this.permissions.employee.id}/requests?${filter}`,
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
      `${this.urlPath}/${this.permissions.employee.id}/requests/type/extraHours/${reqId}?${filter}`,
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
      `${this.urlPath}/${this.permissions.employee.id}/requests/type/extraHours/new`,
      {
        countHD: xHRequest.countHD,
        employeeNotes: xHRequest.employeeNotes,
        employeeId: xHRequest.employeeId,
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
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/extraHours/${reqId}`,
        {
          id: reqId,
          approvementId: 'POOL00000000044',
          managerNotes: notes
        },
        {headers: header}
      );
    } else if (type === 'deny') {
      return this.http.put(
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/extraHours/${reqId}`,
        {
          id: reqId,
          approvementId: 'POOL00000000045',
          managerNotes: notes
        },
        {headers: header}
      );
    } else if (type === 'authorize') {
      return this.http.put(
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/extraHours/${reqId}`,
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
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/extraHours/${reqId}`,
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
      `${this.urlPath}/${this.permissions.employee.id}/requests/type/extraHours/${reqId}`,
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
      `${this.urlPath}/${this.permissions.employee.id}/requests/type/holidays/${reqId}?${filter}`,
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
      `${this.urlPath}/${this.permissions.employee.id}/requests/type/holidays/new`,
      {
        countHD: hRequest.countHD,
        employeeNotes: hRequest.employeeNotes,
        employeeId: hRequest.employeeId,
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
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/holidays/${reqId}`,
        {
          id: reqId,
          approvementId: 'POOL00000000044',
          managerNotes: notes
        },
        {headers: header}
      );
    } else if (type === 'deny') {
      return this.http.put(
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/holidays/${reqId}`,
        {
          id: reqId,
          approvementId: 'POOL00000000045',
          managerNotes: notes
        },
        {headers: header}
      );
    } else if (type === 'authorize') {
      return this.http.put(
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/holidays/${reqId}`,
        {
          id: reqId,
          authorizationId: 'POOL00000000041',
          directorNotes: notes
        },
        {headers: header}
      );
    } else {
      return this.http.put(
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/holidays/${reqId}`,
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
      `${this.urlPath}/${this.permissions.employee.id}/requests/type/holidays/${reqId}`,
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
      `${this.urlPath}/${this.permissions.employee.id}/requests/type/missions/${reqId}?${filter}`,
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
      `${this.urlPath}/${this.permissions.employee.id}/requests/type/missions/new`,
      {
        employeeNotes: hRequest.employeeNotes,
        employeeId: hRequest.employeeId,
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
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/missions/${reqId}`,
        {
          id: reqId,
          approvementId: 'POOL00000000044',
          managerNotes: notes
        },
        {headers: header}
      );
    } else {
      return this.http.put(
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/missions/${reqId}`,
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
      `${this.urlPath}/${this.permissions.employee.id}/requests/type/holidays/${reqId}`,
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
      `${this.urlPath}/${this.permissions.employee.id}/requests/type/missingBadge/${reqId}?${filter}`,
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
      `${this.urlPath}/${this.permissions.employee.id}/requests/type/missingBadge/new`,
      {
        employeeNotes: mBRequest.employeeNotes,
        employeeId: mBRequest.employeeId,
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
      `${this.urlPath}/${this.permissions.employee.id}/requests/type/missingBadge/${reqId}`,
      {headers: header});
  }
  // SUBSTITUTED_HOLIDAYS-------------------------------------------------------------------------------------------------------------------

  // get substituted holidays single request
  getSubHolyRequest(reqId: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    const filter = 'paramBean={fillFieldLabels:true}';
    return this.http.get(
      `${this.urlPath}/${this.permissions.employee.id}/requests/type/substitutions/${reqId}?${filter}`,
      {headers: header});
  }

  // insert new substituted holidays request
  insertSubHolyRequest(sHRequest?: RequestSubstituteModel) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang'),
      'Content-Type': 'application/json'
    });
    return this.http.post(
      `${this.urlPath}/${this.permissions.employee.id}/requests/type/substitutions/new`,
      {
        employeeId: sHRequest.employeeId,
        startTimestamp: sHRequest.startTimestamp,
        stopTimestamp: sHRequest.stopTimestamp,
        countHD: sHRequest.countHD,
        substitutionDates: sHRequest.substitutionDates,
        requestTypeId: 'POOL00000000082',
        employeeNotes: sHRequest.employeeNotes
      },
      {headers: header});
  }

  // manage substituted holidays request (approve/deny/authorize/not authorize)
  managerNdirectorDecisionSubHolyRequest(type: string, reqId: string, notes: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang'),
      'Content-Type': 'application/json'
    });
    if (type === 'approve') {
      return this.http.put(
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/substitutions/${reqId}`,
        {
          id: reqId,
          approvementId: 'POOL00000000044',
          managerNotes: notes
        },
        {headers: header}
      );
    } else if (type === 'deny') {
      return this.http.put(
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/substitutions/${reqId}`,
        {
          id: reqId,
          approvementId: 'POOL00000000045',
          managerNotes: notes
        },
        {headers: header}
      );
    } else if (type === 'authorize') {
      return this.http.put(
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/substitutions/${reqId}`,
        {
          id: reqId,
          authorizationId: 'POOL00000000041',
          directorNotes: notes
        },
        {headers: header}
      );
    } else {
      return this.http.put(
        `${this.urlPath}/${this.permissions.employee.id}/requests/type/substitutions/${reqId}`,
        {
          id: reqId,
          authorizationId: 'POOL00000000042',
          directorNotes: notes
        },
        {headers: header}
      );
    }
  }

  // delete substituted holidays request
  deleteSubHolyRequest(reqId: string) {
    const header = new Headers({
      'Authorization': localStorage.getItem('EmpAuthToken'),
      'Accept': 'application/json',
      'Accept-Language': localStorage.getItem('EmpLang')
    });
    return this.http.delete(
      `${this.urlPath}/${this.permissions.employee.id}/requests/type/substitutions/${reqId}`,
      {headers: header});
  }
}
