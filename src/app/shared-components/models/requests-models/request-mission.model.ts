import {RequestAbstractModel} from './request-abstract.model';

export class RequestMissionModel extends RequestAbstractModel<string> {
  approvementId: string;
  managerNotes: string;
  managerId: string;
  missionWhere: string;
  approvementDate: string;
  missionTypeId: string;
  insertOperator: string;
  labelMap: {
    requestTypeId: string;
    employeeId: string;
    managerId: string;
    directorId: string;
    officeNameId: string;
    approvementId: string;
    missionTypeId: string;
  };
}
