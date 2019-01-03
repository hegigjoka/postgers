import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reuests-container',
  templateUrl: './reuests-container.component.html',
  styleUrls: ['./reuests-container.component.css']
})
export class ReuestsContainerComponent implements OnInit {
  title = 'All Requests';
  reqType = 'all';
  paginate = 1;

  constructor() { }

  ngOnInit() {
  }

  getRequests() {}

  // Request Filters
  all() {
    this.title = 'All Requests';
    this.reqType = 'all';
    this.getRequests();
  }

  onlyMR() {
    this.title = 'My Requests';
    this.reqType = 'my';
    this.getRequests();
  }

  onlyMPR() {
    this.title = 'My Pending Requests';
    this.reqType = 'myp';
    this.getRequests();
  }

  onlyPA() {
    this.title = 'Pending Action';
    this.reqType = 'pa';
    this.getRequests();
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
