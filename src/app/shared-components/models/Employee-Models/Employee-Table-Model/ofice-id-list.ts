import {OfficeIdFields} from './office-id-fields';

export class OficeIdList {
  fieldName: string;
  fieldLabel: string;
  inputType: string;
  canGet: boolean;
  canPost: boolean;
  canPut: boolean;
  fieldDataPool: [
    {
      list: OfficeIdFields[];
      pageNo: number;
      pageSize: number;
      totalPages: number;
      totalRecords: number;
    }
    ];
}
