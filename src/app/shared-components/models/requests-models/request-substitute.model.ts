import {RequestAbstractModel} from './request-abstract.model';

export class RequestSubstituteModel extends RequestAbstractModel<string> {
  directorNotes: string;
  authorizationDate: string;
  directorId: string;
  authorizationId: string;
  approvementId: string;
  managerNotes: string;
  managerId: string;
  substitutionDates: string[];
  approvementDate: string;
  insertOperator: string;
  countHD: number;
  holidayTypeId: string;
  labelMap: {
    requestTypeId: string;
    employeeId: string;
    managerId: string;
    directorId: string;
    officeNameId: string;
    approvementId: string;
    authorizationId: string;
    holidayTypeId: string;
  };
}
