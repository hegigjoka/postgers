import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EmployeeService} from '../../../../shared-components/providers/employee.service';
import {
  EmployeeTableFieldGroup
} from '../../../../shared-components/models/employee-models/employee-table-field-group';
import {ListResponseModel} from '../../../../shared-components/models/shared-models/list-response.model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSidenav} from '@angular/material';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs';
import {EmployeeModel} from '../../../../shared-components/models/employee-models/employee.model';

@Component({
  selector: 'app-employee-panel',
  templateUrl: './employee-panel.component.html',
  styleUrls: ['./employee-panel.component.css']
})
export class EmployeePanelComponent implements OnInit, OnDestroy {
  // variables
  @ViewChild('employeeMenu') empMenu: MatSidenav;
  sideNav: string;
  private sub: Subscription = new Subscription();
  paginate = 1;
  tableFields: EmployeeTableFieldGroup;
  employees: ListResponseModel<EmployeeModel>;

  // constructor
  constructor(
    private empserve: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private loc: Location
  ) {}

  // on init component
  ngOnInit() {
    this.getStatus();
    this.getEmployeeOptions();
    this.getEmployees();
  }

  // on destroy component
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // authenticate
  getStatus() {
    this.empserve.getAppStatus(localStorage.getItem('EmpAuthToken')).subscribe(
      () => {
        this.router.navigate(['.'], {relativeTo: this.route});
      },
      (error) => {
        localStorage.removeItem('EmpAuthToken');
        localStorage.removeItem('EmpFullName');
        localStorage.removeItem('EmpLang');
        localStorage.removeItem('EmpAvatarImg');
        localStorage.removeItem('EmpAccess');
        this.router.navigate(['sign-in']);
      }
    );
  }

  // remove sidenav
  backing() {
    if (this.sideNav === 'open') {
      this.sideNav = 'close';
      this.empMenu.toggle();
      this.loc.back();
    }
  }
  updating() {
    this.getEmployees();
    if (this.sideNav === 'open') {
      this.sideNav = 'close';
      this.empMenu.toggle();
    }
  }

  // get employee list
  getEmployees() {
    this.sub.add(
      this.empserve.getEmployeeList(this.paginate, 10).subscribe((empList) => {
        this.employees = empList.json().body.data;
      })
    );
  }

  // get employee table fields
  getEmployeeOptions() {
    this.empserve.getFieldMapEmployee().subscribe((fields) => {
      this.tableFields = fields.json().body.data.fieldMap;
    });
  }

  // get single employee id
  openEmployee(empId: string) {
    this.sideNav = 'open';
    this.empMenu.toggle();
    console.log('open side nav for employee(' + empId + ')');
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
