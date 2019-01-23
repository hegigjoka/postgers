import {RequestAbstractModel} from './request-abstract.model';

export class RequestSubstituteModel extends RequestAbstractModel<string> {
  directorNotes: string;
  authorizationDate: string;
  directorId: string;
  authorizationTypeId: string;
  authorizationId: string;
  approvementId: string;
  managerNotes: string;
  managerId: string;
  substitutionDates: string;
  approvementDate: string;
  insertOperator: string;
  countHD: number;
  holidayTypeId: string;
}
