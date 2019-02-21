// imports
import {Component, OnInit} from '@angular/core';
import {
  EmployeeMetadata
} from '../../../../shared-components/models/employee-models/employee-metadata';
import {Location} from '@angular/common';
import {EmployeeService} from '../../../../shared-components/providers/employee.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EmployeeModel} from '../../../../shared-components/models/employee-models/employee.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ListResponseModel} from '../../../../shared-components/models/shared-models/list-response.model';
import {AbstractModel} from '../../../../shared-components/models/shared-models/abstract.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ConfirmDialogComponent} from '../../../../shared-components/components/confirm-dialog/confirm-dialog.component';
import {HrPermission} from '../../../../shared-components/permissions/hr-permission';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-employee-registration',
  templateUrl: './employee-registration.component.html',
  styleUrls: ['./employee-registration.component.css']
})

export class EmployeeRegistrationComponent implements OnInit {
  // labels var
  labels: EmployeeMetadata;

  // manager var
  managerInput: string;
  managers: ListResponseModel<EmployeeModel>;
  managerSelectedId: string;

  // director var
  directorInput: string;
  directors: ListResponseModel<EmployeeModel>;
  directorSelectedId: string;

  // office var
  officeInput: string;
  offices: AbstractModel[];
  officeSelectedId: string;

  emailRegExp: string;

  // form var
  empId: string;
  newOrOld: boolean;
  employee: EmployeeModel;
  employeeForm: FormGroup;
  confirmation: boolean;

  allowUpdateEmployee: boolean;
  allowDeleteEmployee: boolean;
  // ---------------------------------------------------------------------------------------------------------------------------------------

  constructor(
    private translate: TranslateService,
    public permissions: HrPermission,
    private empServe: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private loc: Location,
    private confirmDialog: MatDialog,
    public chip: MatSnackBar
  ) { }

  ngOnInit() {
    this.getEmployeeOptions();
    this.getOfficeDataList();
    this.employeeForm = new FormGroup({
      id: new FormControl(''),
      labelMap: new FormGroup({}),
      someLabel: new FormControl(''),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      birthdate: new FormControl('', Validators.required),
      managerId: new FormControl('', Validators.required),
      managerFirstName: new FormControl(''),
      managerLastName: new FormControl(''),
      managerEmail: new FormControl(''),
      directorId: new FormControl('', Validators.required),
      directorFirstName: new FormControl(''),
      directorLastName: new FormControl(''),
      directorEmail: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email, this.emailVal.bind(this)]),
      officeNameId: new FormControl('', Validators.required),
      officeName: new FormControl('')
    });
    this.getUrlParam();
    this.newOrOldForm();
    if (this.permissions.hrEmployee.allowPut === true) {
      this.allowUpdateEmployee = true;
    }
    if (this.permissions.hrEmployee.allowDelete === true) {
      this.allowDeleteEmployee = true;
    }
  }
  // ON_INIT_FUNCTIONS----------------------------------------------------------------------------------------------------------------------

  // get employee table fields
  getEmployeeOptions() {
    this.empServe.getFieldMapEmployee().subscribe((fields) => {
      this.labels = fields.json().body.data.fieldMap;
      this.emailRegExp = fields.json().body.data.fieldMap.email.constraintList.Pattern.regexp;
    });
  }

  // get url param
  getUrlParam() {
    this.route.params.subscribe((emp: Params) => {
      this.empId = emp['emp'];
    });
  }

  // control for rendering new or old form
  newOrOldForm() {
    if (this.empId !== 'new-employee') {
      this.newOrOld = false;
      this.getEmployee();
    } else {
      this.newOrOld = true;
    }
  }
  // DATA_LISTS_POPULATORS------------------------------------------------------------------------------------------------------------------

  // get manager dataList
  getManagerDataList() {
    this.empServe.getEmployeeList(1, 100).subscribe((datalist) => {
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
    });
  }

  // set manager, director and office id from datalist
  setMDOId(someLabel, type: string) {
    if (someLabel.length > 0) {
      if (type === 'manager') {
        this.managers.list.forEach((value) => {
          if (value.someLabel === someLabel) {
            this.managerSelectedId = value.id;
          }
        });
      } else if (type === 'director') {
        this.directors.list.forEach((value) => {
          if (value.someLabel === someLabel) {
            this.directorSelectedId = value.id;
          }
        });
      } else {
        this.offices.forEach((value) => {
          if (value.someLabel === someLabel) {
            this.officeSelectedId = value.id;
          }
        });
      }
    }
  }
  // VALIDATORS-----------------------------------------------------------------------------------------------------------------------------

  // director and manager validators
  managerOrDirectorVal(control: FormControl): {[key: string]: boolean} {
    if (!control.value.match(/EMPL[0-9]{11}/) || control.value.match(/EMPL00000000000/)) {
      return {'notValidEmpId': true};
    }
    return null;
  }

  // email validator
  emailVal(control: FormControl): {[key: string]: boolean} {
    if (!control.value.match(this.emailRegExp)) {
      return {'notValidEmail': true};
    }
    return null;
  }

  // office validator
  officeVal(control: FormControl): {[key: string]: boolean} {
    if (!control.value.match(/POOL[0-9]{11}/) || control.value.match(/POOL00000000000/)) {
      return {'notValidOfficeId': true};
    }
    return null;
  }
  // CRUD-----------------------------------------------------------------------------------------------------------------------------------

  // get employee
  getEmployee() {
    this.empServe.getEmployee(this.empId).subscribe((singleEmployee) => {
      this.employee = singleEmployee.json().body.data;
      this.employee.birthdate = this.employee.birthdate.split('T')[0];
      this.employeeForm.setValue(this.employee);
      this.employeeForm.controls['managerId'].setValue(this.employee.managerFirstName + ' ' + this.employee.managerLastName);
      this.employeeForm.controls['directorId'].setValue(this.employee.directorFirstName + ' ' + this.employee.directorLastName);
      this.employeeForm.controls['officeNameId'].setValue(this.employee.officeName);
    });
  }

  // updating and deleting employee
  updateEmployee() {
    if (this.managerSelectedId === undefined) {
      this.employeeForm.controls['managerId'].setValue(this.employee.managerId);
    } else if (this.managerSelectedId.length > 0) {
      this.employeeForm.controls['managerId'].setValue(this.managerSelectedId);
    }
    if (this.directorSelectedId === undefined)  {
      this.employeeForm.controls['directorId'].setValue(this.employee.directorId);
    } else if (this.directorSelectedId.length > 0) {
      this.employeeForm.controls['directorId'].setValue(this.directorSelectedId);
    }
    if (this.officeSelectedId === undefined)  {
      this.employeeForm.controls['officeNameId'].setValue(this.employee.officeNameId);
    } else if (this.officeSelectedId.length > 0) {
      this.employeeForm.controls['officeNameId'].setValue(this.officeSelectedId);
    }

    this.employee = this.employeeForm.value;
    this.empServe.updateEmployee(this.empId, this.employee).subscribe((response) => {
      if (response.json().status.code === 'STATUS_OK') {
        this.chip.open(this.translate.instant('emp_update_tag'), null, {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'left',
          panelClass: ['success-chip']
        });
        this.loc.back();
      } else {
        this.chip.open(this.translate.instant('emp_not_update_tag'), null, {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'left',
          panelClass: ['error-chip']
        });
      }
    });
  }

  // delete employee
  deleteEmployee() {
    const confText = this.translate.instant('emp_delete_conf') + this.employee.someLabel + ' ?';
    const confType = 'del';
    const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {text: confText, conf: this.confirmation, type: confType}
    });
    confDlg.afterClosed().subscribe(result => {
      this.confirmation = result;
      if (this.confirmation === true) {
        this.empServe.deleteEmployee(this.empId).subscribe((response) => {
          if (response.json().status.code === 'STATUS_OK') {
            this.chip.open(this.translate.instant('emp_delete_tag'), null, {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'left',
              panelClass: ['success-chip']
            });
            this.loc.back();
          } else {
            this.chip.open(this.translate.instant('emp_not_delete_tag'), null, {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'left',
              panelClass: ['error-chip']
            });
          }
        });
      } else {
        this.loc.back();
      }
    });
  }

  // reset employee
  reset() {
    this.employeeForm.controls['id'].setValue('');
    this.employeeForm.controls['firstName'].setValue('');
    this.employeeForm.controls['lastName'].setValue('');
    this.employeeForm.controls['birthdate'].setValue('');
    this.employeeForm.controls['managerId'].setValue('');
    this.employeeForm.controls['directorId'].setValue('');
    this.employeeForm.controls['email'].setValue('');
    this.employeeForm.controls['officeNameId'].setValue('');
  }

  // inserting employee
  insertEmployee() {
    this.employeeForm.controls['managerId'].setValue(this.managerSelectedId);
    this.employeeForm.controls['directorId'].setValue(this.directorSelectedId);
    this.employeeForm.controls['officeNameId'].setValue(this.officeSelectedId);

    this.employee = this.employeeForm.value;
    this.empServe.insertEmployee(this.employee).subscribe((response) => {
      if (response.json().status.code === 'STATUS_OK') {
        this.chip.open(this.translate.instant('emp_insert_tag'), null, {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'left',
          panelClass: ['success-chip']
        });
        this.loc.back();
      } else {
        this.chip.open(this.translate.instant('emp_not_insert_tag'), null, {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'left',
          panelClass: ['error-chip']
        });
      }
    });
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
}
