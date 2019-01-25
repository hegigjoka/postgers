import { Component, OnInit } from '@angular/core';
import {RequestExtraHoursMetadata} from '../../../../../shared-components/models/requests-models/request-extra-hours-metadata';
import {RequestsService} from '../../../../../shared-components/providers/requests.service';
import {ActivatedRoute, Params} from '@angular/router';
import {RequestExtraHoursModel} from '../../../../../shared-components/models/requests-models/request-extra-hours.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
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
  date: Date = new Date();
  OfficeId: string;
  ManagerId: string;
  DirectorId: string;

  hasSomeField: boolean;
  hasEmployeeField: boolean;
  displayApprove: boolean;
  displayAuth: boolean;

  constructor(
    private reqServe: RequestsService,
    private empServe: EmployeeService,
    private route: ActivatedRoute,
    public chip: MatSnackBar,
    private loc: Location
  ) { }

  ngOnInit() {
    this.getFields();
    const insertDate = new Date(this.date.valueOf() + 3600000);
    this.requestForm = new FormGroup({
      id: new FormControl(''),
      someLabel: new FormControl(''),
      insertDate: new FormControl(insertDate.toISOString().split('.')[0], Validators.required),
      requestTypeId: new FormControl('POOL00000000081', Validators.required),
      employeeId: new FormControl(localStorage.getItem('EmpId'), Validators.required),
      officeNameId: new FormControl('', Validators.required),
      managerId: new FormControl('', Validators.required),
      directorId: new FormControl('', Validators.required),
      date: new FormControl(this.date.toISOString().split('T')[0], [Validators.required]),
      startTimestamp: new FormControl('', Validators.required),
      stopTimestamp: new FormControl('', Validators.required),
      countHD: new FormControl(0, Validators.required),
      employeeNotes: new FormControl('No notes...'),
      approvementId: new FormControl(''),
      authorizationId: new FormControl(''),
      labelMap: new FormGroup({
        requestTypeId: new FormControl('Extra Hours'),
        employeeId: new FormControl(localStorage.getItem('EmpFullName'))
      })
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

  // Get Extra Hours Request
  getXHrequest() {
    this.reqServe.getExtraHoursRequest(this.reqId).subscribe((request) => {
      this.request = request.json().body.data;
      this.request.insertDate = this.request.insertDate.split('T')[0];

      this.requestForm.controls['id'].setValue(this.request.id);
      this.requestForm.controls['someLabel'].setValue(this.request.someLabel);
      this.requestForm.controls['insertDate'].setValue(this.request.insertDate);
      this.requestForm.controls['requestTypeId'].setValue(this.request.requestTypeId);
      this.requestForm.controls['employeeId'].setValue(this.request.labelMap.employeeId);
      this.requestForm.controls['date'].setValue(this.request.startTimestamp.split('T')[0]);
      this.requestForm.controls['startTimestamp'].setValue(this.request.startTimestamp.split('T')[1]);
      this.requestForm.controls['stopTimestamp'].setValue(this.request.stopTimestamp.split('T')[1]);
      this.requestForm.controls['countHD'].setValue(this.request.countHD);
      this.requestForm.controls['employeeNotes'].setValue(this.request.employeeNotes);
      if (this.request.approvementId !== '') {
        this.displayApprove = true;
        this.requestForm.controls['approvementId'].setValue(this.request.labelMap.approvementId);
      }
      if (this.request.approvementId === '') {
        this.displayAuth = true;
        this.requestForm.controls['authorizationId'].setValue(this.request.labelMap.authorizationId);
      }

      this.getEmployeeInfo(this.request.employeeId);
    });
  }

  // Get Employee Info
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

  // Insert New Request
  insertRequest() {
    const date = this.requestForm.controls['date'].value.split('T')[0] + 'T';
    const startT = this.requestForm.controls['startTimestamp'].value;
    const stopT = this.requestForm.controls['stopTimestamp'].value;
    const start = new Date(date + startT);
    const stop = new Date(date + stopT);

    this.requestForm.controls['countHD'].setValue(Math.abs((stop.getTime() - start.getTime()) / 3600000));
    this.requestForm.controls['startTimestamp'].setValue(date + startT + ':00');
    this.requestForm.controls['stopTimestamp'].setValue(date + stopT + ':00');

    this.request = this.requestForm.value;
    this.request.officeNameId = this.OfficeId;
    this.request.managerId = this.ManagerId;
    this.request.directorId = this.DirectorId;

    this.reqServe.insertExtraHoursRequest(this.request).subscribe(
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
        this.reset();
      }
    );
  }

  // Reset Request Form
  reset() {
    this.requestForm.controls['date'].setValue('');
    this.requestForm.controls['stopTimestamp'].setValue('');
    this.requestForm.controls['startTimestamp'].setValue('');
    this.requestForm.controls['countHD'].setValue('');
    this.requestForm.controls['employeeNotes'].setValue('');
  }
}
