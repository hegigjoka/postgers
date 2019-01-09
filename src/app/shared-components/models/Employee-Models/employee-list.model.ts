import {EmployeeModel} from './employee.model';

export class EmployeeListModel {
  list: EmployeeModel[];
  pageNo: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}
