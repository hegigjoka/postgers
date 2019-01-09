import {Component, OnInit} from '@angular/core';
import {Response} from '@angular/http';
import {EmployeeService} from './shared-components/providers/employee.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private getStatus: EmployeeService, private router: Router) {}

  ngOnInit() {}
}
