import {RequestAbstractModel} from './request-abstract.model';

export class RequestMissingBadgeModel extends RequestAbstractModel<string> {
  badgeFailTypeId: string;
  managerId: string;
  managerNotes: string;
  approvementId: string;
  approvementDate: string;
  insertOperator: string;
  labelMap: {
    requestTypeId: string;
    employeeId: string;
    approvementId: string;
    authorizationId: string;
    officeNameId: string
    badgeFailTypeId: string;
  };
}
