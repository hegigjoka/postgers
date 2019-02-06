import {RequestAbstractModel} from './request-abstract.model';
import {FieldMetadataModel} from '../shared-models/field-metadata.model';

export class RequestMissionMetadata extends RequestAbstractModel<FieldMetadataModel<any>>{
  approvementId: FieldMetadataModel<any>;
  managerNotes: FieldMetadataModel<any>;
  managerId: FieldMetadataModel<any>;
  missionWhere: FieldMetadataModel<any>;
  approvementDate: FieldMetadataModel<any>;
  missionTypeId: FieldMetadataModel<any>;
  insertOperator: FieldMetadataModel<any>;
}
