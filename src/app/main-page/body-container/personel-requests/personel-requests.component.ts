import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ListResponseModel} from '../../../shared-components/models/shared-models/list-response.model';
import {RequestModel} from '../../../shared-components/models/requests-models/request.model';
import {RequestsService} from '../../../shared-components/providers/requests.service';
import {RequestTableMetadata} from '../../../shared-components/models/requests-models/request-table-metadata';
import {MatSidenav} from '@angular/material';
import {Location} from '@angular/common';

@Component({
  selector: 'app-personel-requests',
  templateUrl: './personel-requests.component.html',
  styleUrls: ['./personel-requests.component.css']
})
export class PersonelRequestsComponent implements OnInit {
// filter variables
  paginate = 1;

  requestTypeInput: string;
  requestType = [
    {id: 'POOL00000000078', someLabel: 'Mission'},
    {id: 'POOL00000000079', someLabel: 'Holiday and Permission'},
    {id: 'POOL00000000080', someLabel: 'Badge Fail'},
    {id: 'POOL00000000081', someLabel: 'Extra Hours'},
    {id: 'POOL00000000082', someLabel: 'Substituted Holidays'}
  ];

  // request table variables
  fields: RequestTableMetadata;
  requests: ListResponseModel<RequestModel>;
  @ViewChild('request') reqMenu: MatSidenav;
  sideNav = 'close';

  constructor(private reqServe: RequestsService, private router: Router, private route: ActivatedRoute, private loc: Location) { }

  ngOnInit() {
    this.getOptions();
    this.getRequests();
  }

  getOptions() {
    this.reqServe.getTableOptions().subscribe((fields) => {
      this.fields = fields.json().body.data.fieldMap;
    });
  }

  getRequests() {
    this.reqServe.getRequestsList(this.paginate, 10).subscribe((response) => {
      this.requests = response.json().body.data;
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
    this.getRequests();
  }

  // open single request
  openRequest(reqId: string, reqType: string) {
    this.sideNav = 'open';
    this.reqMenu.toggle();
    reqType = reqType.toLowerCase().replace(' ', '-');
    if (reqType.match(' ')) {
      reqType = reqType.replace(' ', '-');
    }
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
