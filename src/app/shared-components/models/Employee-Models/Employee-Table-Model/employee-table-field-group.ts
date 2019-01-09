import {EmployeeTableFields} from './employee-table-fields';
import {EmployeeIdFields} from './employee-id-fields';
import {OfficeIdFields} from './office-id-fields';

export class EmployeeTableFieldGroup {
  lastName: EmployeeTableFields;
  officeName: EmployeeTableFields;
  birthdate: EmployeeTableFields;
  directorLastName: EmployeeTableFields;
  directorId: EmployeeIdFields;
  directorFirstName: EmployeeTableFields;
  directorEmail: EmployeeTableFields;
  officeNameId: OfficeIdFields;
  managerId: EmployeeIdFields;
  managerLastName: EmployeeTableFields;
  firstName: EmployeeTableFields;
  managerEmail: EmployeeTableFields;
  managerFirstName: EmployeeTableFields;
  id: EmployeeTableFields;
  someLabel: EmployeeTableFields;
  email: EmployeeTableFields;
}
