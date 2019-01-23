import {RequestAbstractModel} from './request-abstract.model';
import {FieldMetadataModel} from '../shared-models/field-metadata.model';

export class RequestSubstituteMetadata extends RequestAbstractModel<FieldMetadataModel<any>>{
  directorNotes: FieldMetadataModel<any>;
  authorizationDate: FieldMetadataModel<any>;
  directorId: FieldMetadataModel<any>;
  authorizationTypeId: FieldMetadataModel<any>;
  authorizationId: FieldMetadataModel<any>;
  approvementId: FieldMetadataModel<any>;
  managerNotes: FieldMetadataModel<any>;
  managerId: FieldMetadataModel<any>;
  substitutionDates: FieldMetadataModel<any>;
  approvementDate: FieldMetadataModel<any>;
  insertOperator: FieldMetadataModel<any>;
  countHD: FieldMetadataModel<any>;
  holidayTypeId: FieldMetadataModel<any>;
}
