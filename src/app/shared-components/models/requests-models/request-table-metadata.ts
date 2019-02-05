import {RequestAbstractModel} from './request-abstract.model';
import {FieldMetadataModel} from '../shared-models/field-metadata.model';

export class RequestTableMetadata extends RequestAbstractModel<FieldMetadataModel<any>> {
  authorizationDate: FieldMetadataModel<any>;
  authorizationTypeId: FieldMetadataModel<any>;
  authorizationId: FieldMetadataModel<any>;
  approvementId: FieldMetadataModel<any>;
  validationDate: FieldMetadataModel<any>;
  substitutionDates: FieldMetadataModel<any>;
  missionTypeId: FieldMetadataModel<any>;
  expireDate: FieldMetadataModel<any>;
  countHD: FieldMetadataModel<any>;
  empIds: FieldMetadataModel<any>;
  processedId: FieldMetadataModel<any>;
  holidayTypeId: FieldMetadataModel<any>;
  directorNotes: FieldMetadataModel<any>;
  directorId: FieldMetadataModel<any>;
  badgeFailTypeId: FieldMetadataModel<any>;
  managerNotes: FieldMetadataModel<any>;
  managerId: FieldMetadataModel<any>;
  missionWhere: FieldMetadataModel<any>;
  approvementDate: FieldMetadataModel<any>;
  insertOperator: FieldMetadataModel<any>;
  pendingActionFrom: FieldMetadataModel<any>;
  status: FieldMetadataModel<any>;
}
