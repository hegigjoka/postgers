import {RequestAbstractModel} from './request-abstract.model';

export class RequestMissingBadgeModel extends RequestAbstractModel<string> {
  badgeFailTypeId: string;
  approvementId: string;
  insertOperator: string;
}
