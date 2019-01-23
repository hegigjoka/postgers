import {FieldMetadataModel} from '../shared-models/field-metadata.model';
import {AbstractModel} from '../shared-models/abstract.model';

export class EmployeeMetadata {
  lastName: FieldMetadataModel<AbstractModel>;
  officeName: FieldMetadataModel<AbstractModel>;
  birthdate: FieldMetadataModel<AbstractModel>;
  directorLastName: FieldMetadataModel<AbstractModel>;
  directorId: FieldMetadataModel<AbstractModel>;
  directorFirstName: FieldMetadataModel<AbstractModel>;
  directorEmail: FieldMetadataModel<AbstractModel>;
  officeNameId: FieldMetadataModel<AbstractModel>;
  managerId: FieldMetadataModel<AbstractModel>;
  managerLastName: FieldMetadataModel<AbstractModel>;
  firstName: FieldMetadataModel<AbstractModel>;
  managerEmail: FieldMetadataModel<AbstractModel>;
  managerFirstName: FieldMetadataModel<AbstractModel>;
  id: FieldMetadataModel<AbstractModel>;
  someLabel: FieldMetadataModel<AbstractModel>;
  email: FieldMetadataModel<AbstractModel>;
}
