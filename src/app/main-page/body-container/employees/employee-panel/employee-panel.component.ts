import {Component, OnInit, ViewChild} from '@angular/core';
import {EmployeeService} from '../../../../shared-components/providers/employee.service';
import {EmployeeTableFieldGroup} from '../../../../shared-components/models/Employee-Models/Employee-Table-Model/employee-table-field-group';
import {EmployeeListModel} from '../../../../shared-components/models/Employee-Models/employee-list.model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSidenav} from '@angular/material';
import {Location} from '@angular/common';

@Component({
  selector: 'app-employee-panel',
  templateUrl: './employee-panel.component.html',
  styleUrls: ['./employee-panel.component.css']
})
export class EmployeePanelComponent implements OnInit {
  // variables
  @ViewChild('employeeMenu') empMenu: MatSidenav;
  paginate = 1;
  tableFields: EmployeeTableFieldGroup;
  employees: EmployeeListModel;

  // constructor
  constructor(
    private empserve: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private loc: Location
  ) { }

  // on init component
  ngOnInit() {
    // this.getStatus();
    this.getEmployeeOptions();
    this.getEmployees();
  }

  // removing employee id from url
  backing() {
    this.loc.back();
  }

  // get employee list
  getEmployees() {
    this.empserve.getEmployeeList(this.paginate, 10).subscribe((empList) => {
      this.employees = empList.json().body.data;
    });
  }

  // get employee table fields
  getEmployeeOptions() {
    this.empserve.getFieldMapEmployee().subscribe((fields) => {
      this.tableFields = fields.json().body.data.fieldMap;
    });
  }

  // authorization mean
  // getStatus() {
  //   this.empserve.getAppStatus().subscribe((type: Response) => {
  //     if (type.statusText === 'Unauthorized') {
  //       this.empserve.logoutApp().subscribe(() => {
  //         this.router.navigate(['sign-in']);
  //       });
  //     }
  //   });
  // }

  // get single employee id
  openEmployee(empId: string) {
    this.empMenu.toggle();
    this.router.navigate([empId], {relativeTo: this.route});
  }

  // paginate
  pages(move: number, totalPages: number) {
    if (this.paginate > 1 && this.paginate < totalPages) {
      if (move === 1 && this.paginate < totalPages) {
        this.paginate++;
        this.getEmployees();
      } else if (move === -1 && this.paginate > 1) {
        this.paginate--;
        this.getEmployees();
      }
    } else if (this.paginate === totalPages && move === -1) {
      if (this.paginate > 1) {
        this.paginate--;
        this.getEmployees();
      }
    } else if (this.paginate === 1 && move === 1) {
      if (this.paginate < totalPages) {
        this.paginate++;
        this.getEmployees();
      }
    }
  }
}
