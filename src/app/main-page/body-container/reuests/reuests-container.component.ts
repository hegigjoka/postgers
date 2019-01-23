import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ListResponseModel} from '../../../shared-components/models/shared-models/list-response.model';
import {RequestModel} from '../../../shared-components/models/requests-models/request.model';
import {RequestsService} from '../../../shared-components/providers/requests.service';
import {RequestTableMetadata} from '../../../shared-components/models/requests-models/request-table-metadata';
import {MatSidenav} from '@angular/material';
import {Location} from '@angular/common';

@Component({
  selector: 'app-reuests-container',
  templateUrl: './reuests-container.component.html',
  styleUrls: ['./reuests-container.component.css']
})
export class ReuestsContainerComponent implements OnInit {
  // filter variables
  title = 'All Requests';
  reqType: string;
  paginate = 1;

  // request table variables
  fields: RequestTableMetadata;
  requests: ListResponseModel<RequestModel>;
  @ViewChild('request') reqMenu: MatSidenav;
  sideNav = 'close';

  constructor(private reqServe: RequestsService, private router: Router, private route: ActivatedRoute, private loc: Location) { }

  ngOnInit() {
    this.route.queryParams.subscribe((reqtype: Params) => {
      this.reqType = reqtype['type'];
    });
    if (this.reqType === 'all') {
      this.title = 'All Requests';
    } else if (this.reqType === 'me') {
      this.title = 'My Requests';
    } else {
      this.title = 'Pending Action';
    }
    this.getOptions();
    this.getRequests();
  }

  getOptions() {
    this.reqServe.getTableOptions().subscribe((fields) => {
      this.fields = fields.json().body.data.fieldMap;
    });
  }

  getRequests() {
    this.reqServe.getRequestsList(this.paginate, 10, this.reqType).subscribe((response) => {
      this.requests = response.json().body.data;
    });
  }

  changeQueryParam() {
    this.router.navigate(['.'], {relativeTo: this.route, queryParams: {type: this.reqType}});
  }

  // Request Filters
  all() {
    this.title = 'All Requests';
    this.reqType = 'all';
    this.getRequests();
    this.changeQueryParam();
  }

  onlyMR() {
    this.title = 'My Requests';
    this.reqType = 'me';
    this.getRequests();
    this.changeQueryParam();
  }

  onlyPA() {
    this.title = 'Pending Action';
    this.reqType = 'pendingMe';
    this.getRequests();
    this.changeQueryParam();
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
    this.getRequests();
    if (this.sideNav === 'open') {
      this.sideNav = 'close';
      this.reqMenu.toggle();
    }
  }

  // open single request
  openRequest(reqId: string, reqType: string) {
    this.sideNav = 'open';
    this.reqMenu.toggle();
    reqType = reqType.toLowerCase().replace(' ', '-');
    console.log('open side nav for ' + reqType + ' request(' + reqId + ')');
    this.router.navigate([reqType, reqId], {relativeTo: this.route});
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
