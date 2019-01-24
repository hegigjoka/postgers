import { Component, OnInit } from '@angular/core';
import {RequestExtraHoursMetadata} from '../../../../../shared-components/models/requests-models/request-extra-hours-metadata';
import {RequestsService} from '../../../../../shared-components/providers/requests.service';
import {ActivatedRoute, Params} from '@angular/router';
import {RequestExtraHoursModel} from '../../../../../shared-components/models/requests-models/request-extra-hours.model';
import {FormControl, FormGroup} from '@angular/forms';
import {EmployeeModel} from '../../../../../shared-components/models/employee-models/employee.model';
import {EmployeeService} from '../../../../../shared-components/providers/employee.service';
import {AbstractModel} from '../../../../../shared-components/models/shared-models/abstract.model';
import {MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';

@Component({
  selector: 'app-extra-hours-request',
  templateUrl: './extra-hours-request.component.html',
  styleUrls: ['../new-request.components.css']
})
export class ExtraHoursRequestComponent implements OnInit {
  fields: RequestExtraHoursMetadata;
  reqId: string;
  request: RequestExtraHoursModel;
  employee: EmployeeModel;
  offices: AbstractModel[];
  requestForm: FormGroup;
  OfficeId: string;
  ManagerId: string;
  DirectorId: string;

  hasSomeField: boolean;
  hasEmployeeField: boolean;

  constructor(
    private reqServe: RequestsService,
    private empServe: EmployeeService,
    private route: ActivatedRoute,
    public chip: MatSnackBar,
    private loc: Location
  ) { }

  ngOnInit() {
    this.getFields();
    this.requestForm = new FormGroup({
      date: new FormControl(''),
      countHD: new FormControl(0),
      employeeNotes: new FormControl(''),
      managerId: new FormControl(''),
      directorId: new FormControl(''),
      authorizationId: new FormControl(''),
      employeeId: new FormControl(localStorage.getItem('EmpId')),
      officeNameId: new FormControl(''),
      startTimestamp: new FormControl(''),
      stopTimestamp: new FormControl(''),
      insertDate: new FormControl(''),
      requestTypeId: new FormControl('POOL00000000081'),
      approvementId: new FormControl(''),
      labelMap: new FormGroup({
        requestTypeId: new FormControl('Extra Hours'),
        employeeId: new FormControl(localStorage.getItem('EmpFullName'))
      }),
      id: new FormControl(''),
      someLabel: new FormControl('')
    });
    this.getUrlParams();
  }

  getUrlParams() {
    this.route.params.subscribe((requestId: Params) => {
      this.reqId = requestId['reqId'];
    });

    if (this.reqId === 'new') {
      this.hasSomeField = false;
      this.hasEmployeeField = false;

      this.getEmployeeInfo(localStorage.getItem('EmpId'));
      this.requestForm.controls['officeNameId'].disable();
      this.requestForm.controls['managerId'].disable();
      this.requestForm.controls['directorId'].disable();
      console.log('New request values: ', this.requestForm.value);
    } else {
      this.hasSomeField = true;
      this.hasEmployeeField = true;

      this.requestForm.disable();
      this.getXHrequest();

      setTimeout(() => {
        if (this.request.employeeId === localStorage.getItem('EmpId')) {
          this.hasEmployeeField = false;
        }
      }, 360);
    }
  }

  getFields() {
    this.reqServe.getTableOptions('extraHours').subscribe((fields) => {
      this.fields = fields.json().body.data.fieldMap;
    });
  }

  getXHrequest() {
    this.reqServe.getExtraHoursRequest(this.reqId).subscribe((request) => {
      this.request = request.json().body.data;
      this.request.insertDate = this.request.insertDate.split('T')[0];

      this.requestForm.controls['date'].setValue(this.request.stopTimestamp.split('T')[0]);
      this.requestForm.controls['countHD'].setValue(this.request.countHD);
      this.requestForm.controls['employeeNotes'].setValue(this.request.employeeNotes);
      this.requestForm.controls['authorizationId'].setValue(this.request.authorizationId);
      this.requestForm.controls['employeeId'].setValue(this.request.labelMap.employeeId);
      this.requestForm.controls['insertDate'].setValue(this.request.insertDate);
      this.requestForm.controls['requestTypeId'].setValue(this.request.requestTypeId);
      this.requestForm.controls['approvementId'].setValue(this.request.approvementId);
      this.requestForm.controls['id'].setValue(this.request.id);
      this.requestForm.controls['someLabel'].setValue(this.request.someLabel);
      this.requestForm.controls['startTimestamp'].setValue(this.request.startTimestamp.split('T')[1]);
      this.requestForm.controls['stopTimestamp'].setValue(this.request.stopTimestamp.split('T')[1]);

      this.getEmployeeInfo(this.request.employeeId);
    });
  }

  getEmployeeInfo(empId: string) {
    this.empServe.getEmployee(empId).subscribe((managerNdirectorNoffice) => {
      this.employee = managerNdirectorNoffice.json().body.data;
      this.requestForm.controls['managerId'].setValue(this.employee.managerFirstName + ' ' + this.employee.managerLastName);
      this.requestForm.controls['directorId'].setValue(this.employee.directorFirstName + ' ' + this.employee.directorLastName);
      this.ManagerId = this.employee.managerId;
      this.DirectorId = this.employee.directorId;
    });
    this.empServe.getFieldMapEmployee().subscribe((office) => {
      this.offices = office.json().body.data.fieldMap.officeNameId.fieldDataPool.list;
      this.offices.forEach((value) => {
        if (value.id === this.employee.officeNameId) {
          this.requestForm.controls['officeNameId'].setValue(value.someLabel);
          this.OfficeId = value.id;
        }
      });
    });
  }

  insertRequest() {
    this.requestForm.controls['countHD'].setValue(
      parseInt(this.requestForm.controls['stopTimestamp'].value, 10) - parseInt(this.requestForm.controls['startTimestamp'].value, 10) );
    this.requestForm.controls['startTimestamp'].setValue(
      this.requestForm.controls['date'].value.split('T')[0] + 'T' + this.requestForm.controls['startTimestamp'].value + ':00');
    this.requestForm.controls['stopTimestamp'].setValue(
      this.requestForm.controls['date'].value.split('T')[0] + 'T' + this.requestForm.controls['stopTimestamp'].value + ':00');
    this.requestForm.controls['employeeId'].setValue(localStorage.getItem('EmpId'));


    this.request = this.requestForm.value;
    this.request.officeNameId = this.OfficeId;
    this.request.managerId = this.ManagerId;
    this.request.directorId = this.DirectorId;
    console.log('Request body: ', this.request);
    this.reqServe.insertRequest(this.request).subscribe(
      (status) => {
        if (status.json().status.code === 'STATUS_OK') {
          this.chip.open('Extra hour request is sent successfully!', null, {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            panelClass: ['success-chip']
          });
          this.loc.back();
        }
      },
      () => {
        this.chip.open('Extra hour request isn\'t sent, sorry!', null, {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'left',
          panelClass: ['error-chip']
        });
      }
    );
  }

  reset() {
    this.requestForm.controls['id'].setValue('');
    this.requestForm.controls['firstName'].setValue('');
    this.requestForm.controls['lastName'].setValue('');
    this.requestForm.controls['someLabel'].setValue('');
    this.requestForm.controls['birthdate'].setValue('');
    this.requestForm.controls['email'].setValue('');
    this.requestForm.controls['officeNameId'].setValue('');
    this.requestForm.controls['officeName'].setValue('');
    this.requestForm.controls['managerId'].setValue('');
    this.requestForm.controls['managerFirstName'].setValue('');
    this.requestForm.controls['managerLastName'].setValue('');
    this.requestForm.controls['managerEmail'].setValue('');
    this.requestForm.controls['directorId'].setValue('');
    this.requestForm.controls['directorFirstName'].setValue('');
    this.requestForm.controls['directorLastName'].setValue('');
    this.requestForm.controls['startTimestamp'].setValue('');
  }
}
