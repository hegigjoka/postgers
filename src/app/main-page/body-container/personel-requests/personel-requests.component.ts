import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ListResponseModel} from '../../../shared-components/models/shared-models/list-response.model';
import {RequestModel} from '../../../shared-components/models/requests-models/request.model';
import {RequestsService} from '../../../shared-components/providers/requests.service';
import {RequestTableMetadata} from '../../../shared-components/models/requests-models/request-table-metadata';
import {MatDatepickerInputEvent, MatSidenav} from '@angular/material';
import {Location} from '@angular/common';
import {PersonelRequestService} from '../../../shared-components/providers/personel-request.service';
import {EmployeeService} from '../../../shared-components/providers/employee.service';
import {EmployeeModel} from '../../../shared-components/models/employee-models/employee.model';
import {AbstractModel} from '../../../shared-components/models/shared-models/abstract.model';
import {HrPermission} from '../../../shared-components/permissions/hr-permission';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';


@Component({
  selector: 'app-personel-requests',
  templateUrl: './personel-requests.component.html',
  styleUrls: ['./personel-requests.component.css']
})
export class PersonelRequestsComponent implements OnInit {
  // paginate variables
  paginate = 1;
  pageSize = 10;

  // filters
  disableSubs = false;
  monthYear = '';
  selectedYear = '';
  myTrigger: boolean;

  disableVals = false;
  startAuthDate = '';
  endAuthDate = '';
  trigger: boolean;

  employeeId = '';
  employeeInput = '';
  employees: ListResponseModel<EmployeeModel>;

  requestTypeId = '';
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

  // permissions variable
  allowOpenRequest: boolean;

  constructor(
    public brkPoint: BreakpointObserver,
    public permissions: HrPermission,
    private empServe: EmployeeService,
    private reqServe: RequestsService,
    private persReqServe: PersonelRequestService,
    private router: Router,
    private route: ActivatedRoute,
    private loc: Location
  ) {}

  ngOnInit() {
    // in case of opened sidenav while refreshing
    if (this.route.snapshot['_routerState'].url.match(/HREQ[0-9]{11}/)) {
      this.sideNav = 'open';
      if (this.sideNav === 'open') {
        this.reqMenu.toggle();
      }
    }
    // other
    setTimeout(() => {
      this.getOptions()
    }, 600);
    // resize request rows
    this.brkPoint.observe(['(min-height: 920px)']).subscribe((state: BreakpointState) => {
      if (state.matches){
        this.pageSize = 10;
        setTimeout(() => {
          this.getRequests()
        }, 600);
      } else {
        this.pageSize = 6;
        setTimeout(() => {
          this.getRequests()
        }, 600);
      }
    });
    // permissions
    setTimeout(() => {
      if (this.permissions.hrRequestsType.allowGet === true) {
        this.allowOpenRequest = true;
      }
    }, 600);
    // GLOBAL SEARCH
    setTimeout(() => {
      this.route.queryParams.subscribe((search: Params) => {
        if (search['search'] === 'POOL00000000088' || search['search'] === 'POOL00000000089' || search['search'] === 'POOL00000000090') {
          this.processedId = search['search'] ? search['search'] : '';
        } else {
          this.requestTypeId = search['search'] ? search['search'] : '';
        }
        this.getRequests();
      });
    }, 100);
  }

  // GETS AND OPTION------------------------------------------------------------------------------------------------------------------------
  getRequests(refresh?: string) {
    if (refresh === 'refresh') {
      this.paginate = 1;
      this.employeeId = '';
      this.employeeInput = '';
      this.requestTypeId = '';
      this.requestTypeInput = '';
      this.selectedYear = '';
      this.monthYear = '';
      this.startAuthDate = '';
      this.endAuthDate = '';
      this.processedId = 'POOL00000000088';
      this.processedInput = '';
      this.disableSubs = false;
      this.disableVals = false;
    }
    this.persReqServe.getPersonelRequests(
      this.paginate,
      this.pageSize,
      this.processedId,
      this.monthYear ? this.monthYear : '',
      `${this.startAuthDate}|${this.endAuthDate}`,
      this.employeeId,
      this.requestTypeId
    ).subscribe((response) => {
        this.requests = response.json().body.data;
      });
  }

  getEmployee() {
    this.empServe.getEmployeeList(1, 100, this.employeeInput.split(' ')[0]).subscribe((employee) => {
      this.employees = employee.json().body.data;
    });
  }

  getOptions() {
    this.persReqServe.getOptions().subscribe(
      (fields) => {
        this.fields = fields.json().body.data.fieldMap;
        this.requestType = fields.json().body.data.fieldMap.requestTypeId.fieldDataPool.list;
        this.processedTypes = fields.json().body.data.fieldMap.processedId.fieldDataPool.list;
      },
      () => {
        localStorage.removeItem('EmpAuthToken');
        localStorage.removeItem('EmpId');
        localStorage.removeItem('EmpFullName');
        localStorage.removeItem('EmpLang');
        localStorage.removeItem('EmpAvatarImg');
        this.router.navigate(['sign-in']);
      }
    );
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------

  // FILTERS--------------------------------------------------------------------------------------------------------------------------------
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

  year(event: any) {
    const date = new Date(event.toString());
    const year = parseInt(date.toISOString().split('-')[0], 10) + 1;
    this.selectedYear = year.toString();
  }
  month(event: any) {
    const date = new Date(event.toString());
    const month = parseInt(date.toISOString().split('-')[1], 10) + 1;
    if (month === 13) {
      this.selectedYear = '1' + '/' + this.selectedYear;
    } else {
      this.selectedYear = month.toString() + '/' + this.selectedYear;
    }
    this.monthYear = this.selectedYear.split('/')[0] + this.selectedYear.split('/')[1];
    this.getRequests();
    this.selectedYear = `${this.selectedYear.split('/')[1]}-${this.selectedYear.split('/')[0].match(/[0-9]{2}/) ? this.selectedYear.split('/')[0] : '0' + this.selectedYear.split('/')[0]}-01`;
    this.myTrigger = false;
    this.startAuthDate = '';
    this.endAuthDate = '';
    this.disableVals = true;
  }

  setFromDate(date: string, pickerEvent: MatDatepickerInputEvent<Date>) {
    if (date !== null || date !== '') {
      const pickerDateEvent = new Date(pickerEvent.value);
      const newDate = new Date(pickerDateEvent.valueOf() + 8.64e+7);
      this.startAuthDate = newDate.toISOString().split('.')[0];
      this.endAuthDate = newDate.toISOString().split('.')[0];
      this.disableSubs = true;
      setTimeout(() => {
        this.trigger = !(this.trigger);
      }, 600);
    }
  }
  setToDate(date: string, pickerEvent: MatDatepickerInputEvent<Date>) {
    if (date !== null || date !== '') {
      const pickerDateEvent = new Date(pickerEvent.value);
      const newDate = new Date(pickerDateEvent.valueOf() + 8.64e+7);
      this.endAuthDate = newDate.toISOString().split('.')[0];
      this.trigger = !(this.trigger);
      this.disableSubs = true;
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
    } else if (filter === 'sub-date-filter') {
      this.selectedYear = '';
      this.monthYear = '';
      this.disableVals = false;
    } else if (filter === 'start-date-filter') {
      this.startAuthDate = '';
      this.endAuthDate = '';
      this.disableSubs = false;
    } else if (filter === 'stop-date-filter') {
      this.endAuthDate = '';
    } else {
      this.processedId = 'POOL00000000088';
      this.processedInput = '';
    }
    this.paginate = 1;
    this.getRequests();
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------

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
      if (reqType === 'POOL00000000078') {
        reqType = 'mission';
      } else if (reqType === 'POOL00000000079') {
        reqType = 'holiday-and-permission';
      } else if (reqType === 'POOL00000000080') {
        reqType = 'badge-fail';
      } else if (reqType === 'POOL00000000081') {
        reqType = 'extra-hours';
      } else if (reqType === 'POOL00000000082') {
        reqType = 'substituted-holidays';
      }
      this.router.navigate([reqType, reqId], {relativeTo: this.route});
    }
  }

  // Pagination
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
