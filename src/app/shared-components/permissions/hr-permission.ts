import {Injectable} from '@angular/core';

@Injectable()
export class HrPermission {
  employee = new EmployeeId();
  hrAllRequest = new Permission();
  hrEmployee = new Permission();
  hrRequests = new Permission();
  hrRequestsType = new Permission();
}

export class Permission {
  allowList: boolean;
  allowGet: boolean;
  allowPost: boolean;
  allowPut: boolean;
  allowDelete: boolean;
  id: string;

  constructor() {
    this.allowList = false;
    this.allowGet = false;
    this.allowPost = false;
    this.allowPut = false;
    this.allowDelete = false;
  }
}
export class EmployeeId {
  id: string;
  img: string;
  fullName: string;

  constructor() {
    this.id = '';
    this.img = '';
    this.fullName = '';
  }
}
