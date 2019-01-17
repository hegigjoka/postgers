import {ListResponseModel} from './list-response.model';
import {OfficeFieldsModel} from '../employee-models/office-fields.model';

export class FieldMetadataModel {
  fieldName: string;
  fieldLabel: string;
  inputType: string;
  canGet: boolean;
  canPost: boolean;
  canPut: boolean;
  fieldDataPool: ListResponseModel<OfficeFieldsModel>[];
  fieldRestPool: string;
  fieldRestVal: string;
}
