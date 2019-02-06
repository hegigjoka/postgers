import {RequestAbstractModel} from './request-abstract.model';
import {FieldMetadataModel} from '../shared-models/field-metadata.model';

export class RequestMissingBadgeMetadata extends RequestAbstractModel<FieldMetadataModel<any>> {
  badgeFailTypeId: FieldMetadataModel<any>;
  managerId: FieldMetadataModel<any>;
  managerNotes: FieldMetadataModel<any>;
  approvementId: FieldMetadataModel<any>;
  approvementDate: FieldMetadataModel<any>;
  insertOperator: FieldMetadataModel<any>;
}
