import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EmployeeService} from '../../../../shared-components/providers/employee.service';
import {
  EmployeeMetadata
} from '../../../../shared-components/models/employee-models/employee-metadata';
import {ListResponseModel} from '../../../../shared-components/models/shared-models/list-response.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MatSidenav} from '@angular/material';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs';
import {EmployeeModel} from '../../../../shared-components/models/employee-models/employee.model';
import {AbstractModel} from '../../../../shared-components/models/shared-models/abstract.model';
import {HrPermission} from '../../../../shared-components/permissions/hr-permission';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';

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
  pageSize = 10;
  tableFields: EmployeeMetadata;
  employees: ListResponseModel<EmployeeModel>;

  // filter variables
  someLabelFilter = '';

  offices: AbstractModel[];
  officeFilter = '';
  officeId: string;

  managers: ListResponseModel<EmployeeModel>;
  managerFilter = '';
  managerId: string;

  directors: ListResponseModel<EmployeeModel>;
  directorFilter = '';
  directorId: string;

  // permissions variables
  allowOpenEmployee: boolean;
  allowNewEmployee: boolean;

  constructor(
    public brkPoint: BreakpointObserver,
    public permissions: HrPermission,
    private empserve: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private loc: Location
  ) {}

  ngOnInit() {
    // in case of opened sidenav while refreshing
    if (this.route.snapshot['_routerState'].url.match(/EMPL[0-9]{11}/)) {
      this.sideNav = 'open';
      if (this.sideNav === 'open') {
        this.empMenu.toggle();
      }
    }
    // get datalist for filter office
    this.getOfficesDataList();
    // resize employees list
    this.brkPoint.observe(['(min-height: 920px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.pageSize = 10;
        this.getEmployees();
      } else {
        this.pageSize = 6;
        this.getEmployees();
      }
    });
    // permissions
    setTimeout(() => {
      if (this.permissions.hrEmployee.allowGet === true) {
        this.allowOpenEmployee = true;
      }
      if (this.permissions.hrEmployee.allowPost === true) {
        this.allowNewEmployee = true;
      }
    }, 600);
    // GLOBAL SEARCH
    this.route.queryParams.subscribe((search: Params) => {
      this.someLabelFilter = search['search'] ? search['search'] : '';
      this.getEmployees();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  // SIDENAV--------------------------------------------------------------------------------------------------------------------------------

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

  // get single employee id
  openEmployee(empId: string) {
    if (this.allowOpenEmployee === true || (this.allowNewEmployee === true && empId.match(/new-employee/))) {
      this.sideNav = 'open';
      this.empMenu.toggle();
      this.router.navigate([empId], {relativeTo: this.route});
    }
  }
  // FILTERS--------------------------------------------------------------------------------------------------------------------------------

  // get offices datalist
  getOfficesDataList() {
    this.empserve.getFieldMapEmployee().subscribe(
      (response) => {
        this.offices = response.json().body.data.fieldMap.officeNameId.fieldDataPool.list;
        // get employee panel labels(no relation with dataList)
        this.tableFields = response.json().body.data.fieldMap;
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

  // get manager dataList
  getManagerDataList() {
    this.empserve.getEmployeeList(1, 100, this.managerFilter).subscribe((datalist) => {
      this.managers = datalist.json().body.data;
    });
  }

  // get director dataList
  getDirectorDataList() {
    this.empserve.getEmployeeList(1, 100, this.directorFilter).subscribe((datalist) => {
      this.directors = datalist.json().body.data;
    });
  }

  // set manager, director and office id from datalist
  setMDOId(someLabel, type: string) {
    if (someLabel.length > 0) {
      if (type === 'manager') {
        this.managers.list.forEach((value) => {
          if (value.someLabel === someLabel) {
            this.managerId = value.id;
          }
        });
      } else if (type === 'director') {
        this.directors.list.forEach((value) => {
          if (value.someLabel === someLabel) {
            this.directorId = value.id;
          }
        });
      } else {
        this.offices.forEach((value) => {
          if (value.someLabel === someLabel) {
            this.officeId = value.id;
          }
        });
      }
      this.paginate = 1;
      this.getEmployees();
    }
  }

  // set employee name
  setFirstNLast() {
    this.paginate = 1;
    this.getEmployees();
  }

  clearFilter(type: number) {
    if (type === 1) {
      this.someLabelFilter = '';
    } else if (type === 2) {
      this.officeId = '';
      this.officeFilter = '';
    } else if (type === 3) {
      this.managerId = '';
      this.managerFilter = '';
    } else {
      this.directorId = '';
      this.directorFilter = '';
    }
    this.getEmployees();
  }

  // filters
  // filterUp(t: number) {
  //   const type = t.toString();
  //   console.log('Type: ', type);
  //   if (t === 1) {
  //     this.managerFilter = '';
  //     this.directorFilter = '';
  //
  //     this.searchFilter = type + this.someLabelFilter;
  //   } else if (t === 3) {
  //     this.someLabelFilter = '';
  //     this.directorFilter = '';
  //
  //     this.searchFilter = type + this.managerFilter;
  //   } else if (t === 4) {
  //     this.someLabelFilter = '';
  //     this.managerFilter = '';
  //
  //     this.searchFilter = type + this.directorFilter;
  //   }
  // }
  // filterDown() {
  //   console.log('[0]keydown: ', this.someLabelFilter);
  //   if (this.someLabelFilter.length <= 1 || this.managerFilter.length <= 1 || this.directorFilter.length <= 1) {
  //     this.searchFilter = undefined;
  //   }
  //   console.log('[1]keydown: ', this.searchFilter);
  // }
  // ---------------------------------------------------------------------------------------------------------------------------------------

  // get employee datalist
  getEmployees(refresh?: string) {
    if (refresh === 'refresh') {
      this.someLabelFilter = '';
      this.officeFilter = '';
      this.officeId = '';
      this.managerFilter = '';
      this.managerId = '';
      this.directorFilter = '';
      this.directorId = '';
    }
    this.sub.add(
      this.empserve.getEmployeeList(
        this.paginate,
        this.pageSize,
        this.someLabelFilter,
        this.officeId,
        this.managerId,
        this.directorId
      ).subscribe((empList) => {
        this.employees = empList.json().body.data;
      })
    );
  }

  // PAGINATION-------------------------------------------------------------------------------------------------------------------------------
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
    } else if (move === -10 && this.paginate !== 1) {
      this.paginate = 1;
      this.getEmployees();
    } else if (move === 10 && this.paginate !== totalPages) {
      this.paginate = totalPages;
      this.getEmployees();
    }
  }
}
