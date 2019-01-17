import {AbstractModel} from '../shared-models/abstract.model';

export class EmployeeModel extends AbstractModel {
  officeName: string;
  managerFirstName: string;
  managerLastName: string;
  managerEmail: string;
  directorFirstName: string;
  directorLastName: string;
  directorEmail: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  managerId: string;
  directorId: string;
  email: string;
  officeNameId: string;
}
