import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Response} from '@angular/http';
import {EmployeeService} from '../../../shared-components/providers/employee.service';

@Component({
  selector: 'app-reuests-container',
  templateUrl: './reuests-container.component.html',
  styleUrls: ['./reuests-container.component.css']
})
export class ReuestsContainerComponent implements OnInit {
  title = 'All Requests';
  reqType: string;
  paginate = 1;

  constructor(private status: EmployeeService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getStatus();
    this.route.queryParams.subscribe((reqtype: Params) => {
      this.reqType = reqtype['type'];
    });
    if (this.reqType === 'all') {
      this.title = 'All Requests';
    } else if (this.reqType === 'my') {
      this.title = 'My Requests';
    } else if (this.reqType === 'myp') {
      this.title = 'My Pending Requests';
    } else {
      this.title = 'Pending Action';
    }
    this.getRequests();
  }

  getRequests() {}

  getStatus() {
    this.status.getAppStatus().subscribe((type: Response) => {
      if (type.statusText === 'Unauthorized') {
        this.status.logoutApp().subscribe(() => {
          this.router.navigate(['sign-in']);
        });
      }
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
    this.reqType = 'my';
    this.getRequests();
    this.changeQueryParam();
  }

  onlyMPR() {
    this.title = 'My Pending Requests';
    this.reqType = 'myp';
    this.getRequests();
    this.changeQueryParam();
  }

  onlyPA() {
    this.title = 'Pending Action';
    this.reqType = 'pa';
    this.getRequests();
    this.changeQueryParam();
  }

  // Previews and Next
  pages(move: number, totalPages?: number) {
    if (this.paginate > 1 && this.paginate < totalPages) {
      if (move === 1 && this.paginate < totalPages) {
        this.paginate++;
        this.getRequests();
      } else if (move === -1 && this.paginate > 1) {
        this.paginate--;
        this.getRequests();
      }
    } else if (this.paginate === totalPages && move === -1) {
      this.paginate--;
      this.getRequests();
    } else if (this.paginate === 1 && move === 1) {
      this.paginate++;
      this.getRequests();
    }
  }
}
