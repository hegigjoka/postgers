import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ListResponseModel} from '../../../shared-components/models/shared-models/list-response.model';
import {RequestModel} from '../../../shared-components/models/requests-models/request.model';
import {RequestsService} from '../../../shared-components/providers/requests.service';
import {RequestTableMetadata} from '../../../shared-components/models/requests-models/request-table-metadata';
import {MatSidenav} from '@angular/material';
import {Location} from '@angular/common';
import {PersonelRequestService} from '../../../shared-components/providers/personel-request.service';
import {EmployeeService} from '../../../shared-components/providers/employee.service';
import {EmployeeModel} from '../../../shared-components/models/employee-models/employee.model';
import {AbstractModel} from '../../../shared-components/models/shared-models/abstract.model';
import {HrPermission} from '../../../shared-components/permissions/hr-permission';

@Component({
  selector: 'app-personel-requests',
  templateUrl: './personel-requests.component.html',
  styleUrls: ['./personel-requests.component.css']
})
export class PersonelRequestsComponent implements OnInit {
  paginate = 1;

  // filters
  startAuthDate: Date;
  endAuthDate: Date;

  employeeId: string;
  employeeInput = '';
  employees: ListResponseModel<EmployeeModel>;

  requestTypeId: string;
  requestTypeInput: string;
  requestType: AbstractModel[];

  processedId = 'POOL00000000088';
  processedInput = 'Pending';
  processedTypes: AbstractModel[];

  // request table variables
  fields: RequestTableMetadata;
  requests: ListResponseModel<RequestModel>;
  @ViewChild('request') reqMenu: MatSidenav;
  sideNav = 'close';

  allowOpenRequest: boolean;

  constructor(
    public permissions: HrPermission,
    private empServe: EmployeeService,
    private reqServe: RequestsService,
    private persReqServe: PersonelRequestService,
    private router: Router,
    private route: ActivatedRoute,
    private loc: Location
  ) {}

  ngOnInit() {
    this.startAuthDate = null;
    this.endAuthDate = null;
    this.getOptions();
    this.getRequests();
    if (this.permissions.hrRequestsType.allowGet === true) {
      this.allowOpenRequest = true;
    }
  }

  getOptions() {
    this.persReqServe.getOptions().subscribe((fields) => {
      this.fields = fields.json().body.data.fieldMap;
      this.requestType = fields.json().body.data.fieldMap.requestTypeId.fieldDataPool.list;
      this.processedTypes = fields.json().body.data.fieldMap.processedId.fieldDataPool.list;
    });
  }

  getRequests() {
    this.persReqServe.getPersonelRequests(
      this.paginate,
      10,
      this.processedId,
      this.startAuthDate ? this.startAuthDate.toISOString().split('.')[0] : '',
      this.employeeId,
      this.requestTypeId
    ).subscribe((response) => {
      this.requests = response.json().body.data;
    });
  }

  getEmployee() {
    this.empServe.getEmployeeList(1, 100, this.employeeInput.split(' ')[0]).subscribe((employee) => {
      this.employees = employee.json().body.data;
      console.log(this.employees);
    });
  }

  // set manager, director and office id from datalist
  setDERPId(someLabel, type?: string) {
    if (someLabel.length > 0) {
      if (type === 'reqType') {
        this.requestType.forEach((value) => {
          if (value.someLabel === someLabel) {
            this.requestTypeId = value.id;
          }
        });
      } else if (type === 'empId') {
        this.employees.list.forEach((value) => {
          if (value.someLabel === someLabel) {
            this.employeeId = value.id;
          }
        });
      } else if (type === 'process') {
        this.processedTypes.forEach((value) => {
          if (value.someLabel === someLabel) {
            this.processedId = value.id;
          }
        });
      }
      this.paginate = 1;
      this.getRequests();
    }
  }

  clearFilter(filter: string) {
    if (filter === 'emp-filter') {
      this.employeeId = '';
      this.employeeInput = '';
    } else if (filter === 'req-filter') {
      this.requestTypeId = '';
      this.requestTypeInput = '';
    } else if (filter === 'start-date-filter') {
      this.startAuthDate = null;
    } else if (filter === 'stop-date-filter') {
      this.endAuthDate = null;
    } else {
      this.processedId = 'POOL00000000088';
      this.processedInput = '';
    }
    this.paginate = 1;
    this.getRequests();
  }

  refresh() {
    this.paginate = 1;
    this.employeeId = '';
    this.employeeInput = '';
    this.requestTypeId = '';
    this.requestTypeInput = '';
    this.startAuthDate = null;
    this.endAuthDate = null;
    this.processedId = 'POOL00000000088';
    this.processedInput = '';
    this.getRequests();
  }

  // remove sidenav
  backing() {
    if (this.sideNav === 'open') {
      this.sideNav = 'close';
      this.reqMenu.toggle();
      this.loc.back();
    }
  }
  updating() {
    if (this.sideNav === 'open') {
      this.sideNav = 'close';
      this.reqMenu.toggle();
    }
    this.getRequests();
  }

  // open single request
  openRequest(reqId: string, reqType: string) {
    if (this.allowOpenRequest === true) {
      this.sideNav = 'open';
      this.reqMenu.toggle();
      reqType = reqType.toLowerCase().replace(' ', '-');
      if (reqType.match(' ')) {
        reqType = reqType.replace(' ', '-');
      }
      this.router.navigate([reqType, reqId], {relativeTo: this.route});
    }
  }

  // Previews and Next
  pages(move: number, totalPages: number) {
    if (this.paginate > 1 && this.paginate < totalPages) {
      if (move === 1 && this.paginate < totalPages) {
        this.paginate++;
        this.getRequests();
      } else if (move === -1 && this.paginate > 1) {
        this.paginate--;
        this.getRequests();
      }
    } else if (this.paginate === totalPages && move === -1) {
      if (this.paginate > 1) {
        this.paginate--;
        this.getRequests();
      }
    } else if (this.paginate === 1 && move === 1) {
      if (this.paginate < totalPages) {
        this.paginate++;
        this.getRequests();
      }
    } else if (move === -10 && this.paginate !== 1) {
      this.paginate = 1;
      this.getRequests();
    } else if (move === 10 && this.paginate !== totalPages) {
      this.paginate = totalPages;
      this.getRequests();
    }
  }
}
