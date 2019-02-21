import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ListResponseModel} from '../../../shared-components/models/shared-models/list-response.model';
import {RequestModel} from '../../../shared-components/models/requests-models/request.model';
import {RequestsService} from '../../../shared-components/providers/requests.service';
import {RequestTableMetadata} from '../../../shared-components/models/requests-models/request-table-metadata';
import {MatDatepickerInputEvent, MatSidenav} from '@angular/material';
import {Location} from '@angular/common';
import {AbstractModel} from '../../../shared-components/models/shared-models/abstract.model';
import {HrPermission} from '../../../shared-components/permissions/hr-permission';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reuests-container',
  templateUrl: './requests-container.component.html',
  styleUrls: ['./requests-container.component.css']
})
export class RequestsContainerComponent implements OnInit {
  // dropdown variables
  MyLabel: string;
  ActionLabel: string;

  // filter variables
  title: string;
  reqType: string;
  paginate = 1;
  pageSize = 10;
  showBadgeDD = true;
  badge: number;

  startAuthDate = '';
  endAuthDate = '';
  trigger: boolean;

  requestTypeId: string;
  requestTypeInput: string;
  requestTypes: AbstractModel[];

  statusId: string;
  statusInput: string;
  statusTypes: AbstractModel[];

  // request table variables
  fields: RequestTableMetadata;
  requests: ListResponseModel<RequestModel>;
  @ViewChild('request') reqMenu: MatSidenav;
  @ViewChild('dorpdown') dd: ElementRef;
  sideNav = 'close';

  // permissions variables
  allowNewRequest: boolean;
  allowOpenRequest: boolean;

  constructor(
    private translate: TranslateService,
    public brkPoint: BreakpointObserver,
    public permissions: HrPermission,
    private reqServe: RequestsService,
    private router: Router,
    private route: ActivatedRoute,
    private loc: Location
  ) { }

  ngOnInit() {
    // translate dropdown menu links
    if (localStorage.getItem('EmpLang') === 'sq') {
      this.MyLabel = 'Kërkesat e mia';
      this.ActionLabel = 'Veprimet në Pritje';
    } else if (localStorage.getItem('EmpLang') === 'it') {
      this.MyLabel = 'Le mie Richieste';
      this.ActionLabel = 'Azioni in Sospeso';
    } else {
      this.MyLabel = 'My requests';
      this.ActionLabel = 'Pending Actions';
    }
    // in case of open sidenav refresh
    if (this.route.snapshot['_routerState'].url.match(/HREQ[0-9]{11}/)) {
      this.sideNav = 'open';
      if (this.sideNav === 'open') {
        this.reqMenu.toggle();
      }
    }
    // get url requests type
    this.route.queryParams.subscribe((reqType: Params) => {
      this.reqType = reqType['type'];
    });
    if (this.reqType === 'pendingMe') {
      this.title = this.ActionLabel;
    } else {
      this.reqType = 'me';
      this.title = this.MyLabel;
    }
    // some initializations
    setTimeout(() => {
      this.getOptions();
      if (this.permissions.hrRequestsType.allowGet) {
        this.allowOpenRequest = true;
      }
      if (this.permissions.hrRequestsType.allowPost) {
        this.allowNewRequest = true;
      }
    }, 600);
    // resize table row content
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
    // GLOBAL SEARCH
    setTimeout(() => {
      this.route.queryParams.subscribe((search: Params) => {
        if (this.route.snapshot['_routerState'].url.match(/=me/)) {
          this.reqType = 'me';
          this.statusId = search['search'] ? search['search'] : '';
          this.getRequests();
        } else if (this.route.snapshot['_routerState'].url.match(/=pendingMe/)) {
          this.reqType = 'pendingMe';
          this.requestTypeId = search['search'] ? search['search'] : '';
          this.getRequests();
        }
      });
    }, 100);
  }

  // show badge(number of requests)
  showBadge() {
    setInterval(() => {
      if (this.dd.nativeElement.classList.contains('show')) {
        this.showBadgeDD = false;
      } else {
        this.showBadgeDD = true;
      }
    }, 300);
  }

  // Request Filters
  onlyMR() {
    this.title = this.MyLabel;
    this.reqType = 'me';
    this.getRequests();
    this.router.navigate(['.'], {relativeTo: this.route, queryParams: {type: 'me'}});
  }
  onlyPA() {
    this.title = this.ActionLabel;
    this.reqType = 'pendingMe';
    this.getRequests();
    this.router.navigate(['.'], {relativeTo: this.route, queryParams: {type: 'pendingMe'}});
  }
  setTAId(someLabel, type?: string) {
    if (someLabel.length > 0) {
      if (type === 'reqType') {
        this.requestTypes.forEach((value) => {
          if (value.someLabel === someLabel) {
            this.requestTypeId = value.id;
          }
        });
      } else {
        this.statusTypes.forEach((value) => {
          if (value.someLabel === someLabel) {
            this.statusId = value.id;
          }
        });
      }
      this.paginate = 1;
      this.getRequests();
    }
  }
  setFromDate(date: string, pickerEvent: MatDatepickerInputEvent<Date>) {
    if (date !== null || date !== '') {
      const pickerDateEvent = new Date(pickerEvent.value);
      const newDate = new Date(pickerDateEvent.valueOf() + 8.64e+7);
      this.startAuthDate = newDate.toISOString().split('.')[0];
      this.endAuthDate = newDate.toISOString().split('.')[0];
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
      this.getRequests();
    }
  }
  clearFilter(type: string) {
    if (type === 'req-filter') {
      this.requestTypeId = '';
      this.requestTypeInput = '';
    } else if (type === 'start-date-filter') {
      this.startAuthDate = '';
      this.endAuthDate = '';
    } else if (type === 'stop-date-filter') {
      this.endAuthDate = '';
    } else {
      this.statusId = '';
      this.statusInput = '';
    }
    this.paginate = 1;
    this.getRequests();
  }

  // get table and labels options(content labels)
  getOptions() {
    this.reqServe.getTableOptions().subscribe(
      (fields) => {
        this.fields = fields.json().body.data.fieldMap;
        this.requestTypes = fields.json().body.data.fieldMap.requestTypeId.fieldDataPool.list;
        this.statusTypes = fields.json().body.data.fieldMap.status.fieldDataPool.list;
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

  // get request list
  getRequests() {
    this.reqServe.getRequestsList(this.paginate, this.pageSize, this.reqType, `${this.startAuthDate}|${this.endAuthDate}`, this.requestTypeId, this.statusId).subscribe((response) => {
      this.requests = response.json().body.data;
      if (this.reqType === 'pendingMe') {
        this.badge = response.json().body.data.totalRecords;
      }
    });
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
    this.route.queryParams.subscribe((reqType: Params) => {
      this.reqType = reqType['type'];
    });
    setTimeout(() => {
      this.getRequests();
    }, 300);
  }

  // open single request
  openRequest(reqId: string, reqType: string) {
    if (this.allowOpenRequest === true || (this.allowNewRequest === true && reqId.match(/new/))) {
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
