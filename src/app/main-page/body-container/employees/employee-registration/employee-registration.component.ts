import {Component, OnInit} from '@angular/core';
import {EmployeeTableFieldGroup} from '../../../../shared-components/models/Employee-Models/Employee-Table-Model/employee-table-field-group';
import {Response} from '@angular/http';
import {Location} from '@angular/common';
import {EmployeeService} from '../../../../shared-components/providers/employee.service';
import {FormControl, FormGroup} from '@angular/forms';
import {EmployeeModel} from '../../../../shared-components/models/Employee-Models/employee.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {EmployeeInsertUpdateModel} from '../../../../shared-components/models/Employee-Models/employee-insert-update.model';
import {OficeIdList} from '../../../../shared-components/models/Employee-Models/Employee-Table-Model/ofice-id-list';
import {EmployeeListModel} from '../../../../shared-components/models/Employee-Models/employee-list.model';

@Component({
  selector: 'app-employee-registration',
  templateUrl: './employee-registration.component.html',
  styleUrls: ['./employee-registration.component.css']
})
export class EmployeeRegistrationComponent implements OnInit {
  labels: EmployeeTableFieldGroup;

  managerInput: string;
  managers: EmployeeListModel;

  directorInput: string;
  director: EmployeeListModel;

  officeInput: string;
  office: OficeIdList;

  newOrOld: boolean;
  employeeForm: FormGroup;
  empId: string;
  employee: EmployeeModel;
  employeeModel: EmployeeInsertUpdateModel;

  constructor(
    private empServe: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private loc: Location
  ) { }

  ngOnInit() {
    this.getEmployeeOptions();

    this.route.params.subscribe((emp: Params) => {
      this.empId = emp['emp'];
      console.log(this.empId);
    });

    if (this.empId !== 'new-employee') {
      this.newOrOld = false;
      this.getEmployee();
    } else {
      this.newOrOld = true;
    }

    this.employeeForm = new FormGroup({
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      birthdate: new FormControl(null),
      managerId: new FormControl(null),
      directorId: new FormControl(null),
      email: new FormControl(null),
      officeNameId: new FormControl(null)
    });
  }

  // get employee table fields
  getEmployeeOptions() {
    this.empServe.getFieldMapEmployee().subscribe((fields: Response) => {
      this.labels = fields.json().body.data.fieldMap;
    });
  }
  getManagerDataList() {
    this.empServe.getEmployeeList(1, 100, this.managerInput).subscribe((datalist: Response) => {
      this.managers = datalist.json().body.data;
    });
  }

  // get employee
  getEmployee() {
    this.empServe.getEmployee(this.empId).subscribe((singleEmployee: Response) => {
      this.employee = singleEmployee.json().body.data;
    });
  }

  // updating and deleting employee
  updateEmployee() {
    this.employeeModel = this.employeeForm.value;
    this.empServe.updateEmployee(this.empId, this.employeeModel).subscribe((response: Response) => {
      if (response.json().status.code === 'STATUS_OK') {
        alert(this.empId + ' was updated successfully !');
        this.loc.back();
      } else {
        alert('Something went wrong because you are an INDIAN PROGRAMMER :P');
      }
    });
  }
  deleteEmployee() {
    this.empServe.deleteEmployee(this.empId).subscribe((response: Response) => {
      if (response.json().status.code === 'STATUS_OK') {
        alert(this.empId + ' was deleted successfully !');
        this.loc.back();
      } else {
        alert('Something went wrong because you are an INDIAN PROGRAMMER :P');
      }
    });
  }
  reset() {
    console.log(this.employeeForm.value);
  }

  // inserting employee
  insertEmployee() {
    this.employeeModel = this.employeeForm.value;
    this.empServe.insertEmployee(this.employeeModel).subscribe((response: Response) => {
      if (response.json().status.code === 'STATUS_OK') {
        alert('The new employee was inserted successfully !');
        this.loc.back();
      } else {
        alert('Something went wrong because you are an INDIAN PROGRAMMER :P');
      }
    });
  }
}
