import {Component, OnInit} from '@angular/core';
import {EmployeeTableFieldGroup} from '../../../../shared-components/models/Employee-Models/Employee-Table-Model/employee-table-field-group';
import {Location} from '@angular/common';
import {EmployeeService} from '../../../../shared-components/providers/employee.service';
import {FormControl, FormGroup} from '@angular/forms';
import {EmployeeModel} from '../../../../shared-components/models/Employee-Models/employee.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {EmployeeInsertUpdateModel} from '../../../../shared-components/models/Employee-Models/employee-insert-update.model';
import {EmployeeListModel} from '../../../../shared-components/models/Employee-Models/employee-list.model';
import {OfficeIdFields} from '../../../../shared-components/models/Employee-Models/Employee-Table-Model/office-id-fields';

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
  directors: EmployeeListModel;

  officeInput: string;
  offices: OfficeIdFields[];

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
      firstName: new FormControl(),
      lastName: new FormControl(),
      birthdate: new FormControl(),
      managerId: new FormControl(),
      directorId: new FormControl(),
      email: new FormControl(),
      officeNameId: new FormControl()
    });
  }

  // get employee table fields
  getEmployeeOptions() {
    this.empServe.getFieldMapEmployee().subscribe((fields) => {
      this.labels = fields.json().body.data.fieldMap;
    });
  }

  // get manager dataList
  getManagerDataList() {
    this.empServe.getEmployeeList(1, 100, this.managerInput).subscribe((datalist) => {
      this.managers = datalist.json().body.data;
    });
  }

  // get director dataList
  getDirectorDataList() {
    this.empServe.getEmployeeList(1, 100, this.directorInput).subscribe((datalist) => {
      this.directors = datalist.json().body.data;
    });
  }

  // get office dataList
  getOfficeDataList() {
    this.empServe.getFieldMapEmployee().subscribe((datalist) => {
      this.offices = datalist.json().body.data.fieldMap.officeNameId.fieldDataPool.list;
      console.log(this.offices);
    });
  }

  // get employee
  getEmployee() {
    this.empServe.getEmployee(this.empId).subscribe((singleEmployee) => {
      this.employee = singleEmployee.json().body.data;
    });
  }

  // updating and deleting employee
  updateEmployee() {
    this.employeeModel = this.employeeForm.value;
    this.empServe.updateEmployee(this.empId, this.employeeModel).subscribe((response) => {
      if (response.json().status.code === 'STATUS_OK') {
        alert(this.empId + ' was updated successfully !');
        this.loc.back();
      } else {
        alert('It is necessary to update all fields !');
      }
    });
  }

  // delete employee
  deleteEmployee() {
    this.empServe.deleteEmployee(this.empId).subscribe((response) => {
      if (response.json().status.code === 'STATUS_OK') {
        alert(this.empId + ' was deleted successfully !');
        this.loc.back();
      } else {
        alert(this.empId + ' has dependencies, so you can not delete it !');
      }
    });
  }

  // reset employee
  reset() {
    this.employee.firstName = '';
    this.employee.lastName = '';
    this.employee.birthdate = '';
    this.employee.managerFirstName = '';
    this.employee.managerLastName = '';
    this.employee.directorFirstName = '';
    this.employee.directorLastName = '';
    this.employee.email = '';
    this.employee.officeName = '';
  }

  // inserting employee
  insertEmployee() {
    this.employeeModel = this.employeeForm.value;
    console.log(this.employeeModel);
    this.empServe.insertEmployee(this.employeeModel).subscribe((response) => {
      if (response.status === 201) {
        alert('The new employee( ' + response.json().body.data.id + ' ) was inserted successfully !');
        this.loc.back();
      } else {
        alert('You must fill all fields !');
      }
    });
  }
}
