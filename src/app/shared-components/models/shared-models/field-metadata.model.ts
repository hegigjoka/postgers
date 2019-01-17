import {ListResponseModel} from './list-response.model';

export class FieldMetadataModel<T> {
  fieldName: string;
  fieldLabel: string;
  inputType: string;
  canGet: boolean;
  canPost: boolean;
  canPut: boolean;
  constraintList: any[];
  fieldDataPool: ListResponseModel<T>[];
  fieldRestPool: string;
  fieldRestVal: string;
}
