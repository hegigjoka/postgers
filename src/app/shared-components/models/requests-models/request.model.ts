import {RequestAbstractModel} from './request-abstract.model';

export class RequestModel extends RequestAbstractModel<string> {
  authorizationDate: string;
  authorizationTypeId: string;
  authorizationId: string;
  approvementId: string;
  validationDate: string;
  substitutionDates: string;
  missionTypeId: string;
  expireDate: string;
  countHD: number;
  empIds: string;
  holidayTypeId: string;
  directorNotes: string;
  directorId: string;
  badgeFailTypeId: string;
  managerNotes: string;
  managerId: string;
  missionWhere: string;
  approvementDate: string;
  insertOperator: string;
  pendingActionFrom: string;
  status: string;
  labelMap: {
    requestTypeId: string;
    employeeId: string;
    pendingActionFrom: string;
    status: string;
  };
}
