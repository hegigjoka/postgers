import {RequestAbstractModel} from './request-abstract.model';

export class RequestExtraHoursModel extends RequestAbstractModel<string> {
  date?: string;
  directorNotes: string;
  authorizationDate: string;
  directorId: string;
  authorizationTypeId: string;
  authorizationId: string;
  approvementId: string;
  managerNotes: string;
  managerId: string;
  approvementDate: string;
  insertOperator: string;
  countHD: number;
  labelMap: {
    requestTypeId: string;
    employeeId: string;
    managerId: string;
    directorId: string;
    officeNameId: string;
    approvementId: string;
    authorizationId: string;
    authorizationTypeId: string;
  };
}
