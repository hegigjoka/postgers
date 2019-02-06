import {FieldMetadataModel} from '../shared-models/field-metadata.model';
import {RequestAbstractModel} from './request-abstract.model';

export class RequestHolidayMetadata extends RequestAbstractModel<FieldMetadataModel<any>> {
  directorNotes: FieldMetadataModel<any>;
  authorizationDate: FieldMetadataModel<any>;
  directorId: FieldMetadataModel<any>;
  authorizationTypeId: FieldMetadataModel<any>;
  authorizationId: FieldMetadataModel<any>;
  approvementId: FieldMetadataModel<any>;
  managerNotes: FieldMetadataModel<any>;
  managerId: FieldMetadataModel<any>;
  approvementDate: FieldMetadataModel<any>;
  insertOperator: FieldMetadataModel<any>;
  countHD: FieldMetadataModel<any>;
  holidayTypeId: FieldMetadataModel<any>;
}
