import {Injectable} from '@angular/core';

@Injectable()
export class HrPermission {
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
  appResourceId: string;
  appRoleId: string;
  id: string;

  constructor() {
    this.allowList = false;
    this.allowGet = false;
    this.allowPost = false;
    this.allowPut = false;
    this.allowDelete = false;
  }
}
