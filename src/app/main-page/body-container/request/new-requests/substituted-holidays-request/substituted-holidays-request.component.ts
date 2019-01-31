import { Component, OnInit } from '@angular/core';
import {RequestsService} from '../../../../../shared-components/providers/requests.service';
import {ActivatedRoute, Params} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EmployeeModel} from '../../../../../shared-components/models/employee-models/employee.model';
import {EmployeeService} from '../../../../../shared-components/providers/employee.service';
import {AbstractModel} from '../../../../../shared-components/models/shared-models/abstract.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';
import {ConfirmDialogComponent} from '../../../../../shared-components/components/confirm-dialog/confirm-dialog.component';
import {RequestSubstituteModel} from '../../../../../shared-components/models/requests-models/request-substitute.model';
import {RequestSubstituteMetadata} from '../../../../../shared-components/models/requests-models/request-substitute-metadata';

@Component({
  selector: 'app-substituted-holidays-request',
  templateUrl: './substituted-holidays-request.component.html',
  styleUrls: ['../new-request.components.css']
})
export class SubstitutedHolidaysRequestComponent implements OnInit {
  fields: RequestSubstituteMetadata;

  holidayTypes: AbstractModel[];
  holidayTypeInput = 'Substitution Holiday Request';
  holyTypeId: string;

  reqId: string;
  request: RequestSubstituteModel;

  employee: EmployeeModel;
  offices: AbstractModel[];
  requestForm: FormGroup;
  date: Date = new Date();
  OfficeId: string;
  ManagerId: string;
  DirectorId: string;

  hasSomeField: boolean;
  hasEmployeeField: boolean;
  isDeletable: boolean;
  isManager: boolean;
  displayApprove: boolean;
  isDirector: boolean;
  displayAuth: boolean;
  confirmation: boolean;

  constructor(
    private reqServe: RequestsService,
    private empServe: EmployeeService,
    private route: ActivatedRoute,
    private confirmDialog: MatDialog,
    public chip: MatSnackBar,
    private loc: Location
  ) { }

  ngOnInit() {
    this.getFields();
    this.getEmployeeInfo(localStorage.getItem('EmpId'));

    const insertDate = new Date(this.date.valueOf() + 3600000);
    this.requestForm = new FormGroup({
      id: new FormControl(''),
      someLabel: new FormControl(''),
      insertDate: new FormControl(insertDate.toISOString().split('.')[0], Validators.required),
      requestTypeId: new FormControl('POOL00000000082', Validators.required),
      holidayTypeId: new FormControl('Substitution Holiday Request', Validators.required),
      employeeId: new FormControl(localStorage.getItem('EmpId'), Validators.required),
      officeNameId: new FormControl('', Validators.required),
      managerId: new FormControl('', Validators.required),
      directorId: new FormControl('', Validators.required),
      startTimestamp: new FormControl('', Validators.required),
      stopTimestamp: new FormControl('', Validators.required),
      countHD: new FormControl(0, Validators.required),
      employeeNotes: new FormControl('No notes...'),
      approvementId: new FormControl(''),
      authorizationId: new FormControl(''),
      labelMap: new FormGroup({
        requestTypeId: new FormControl('Substituted Holidays'),
        employeeId: new FormControl(localStorage.getItem('EmpFullName')),
        authorizationId: new FormControl('Pending'),
        approvementId: new FormControl('Pending')
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
      this.requestForm.controls['officeNameId'].disable();
      this.requestForm.controls['managerId'].disable();
      this.requestForm.controls['directorId'].disable();
    } else {
      this.hasSomeField = true;
      this.hasEmployeeField = true;
      this.requestForm.disable();
      this.getHrequest();
    }
  }

  getFields() {
    this.reqServe.getTableOptions('holidays').subscribe((fields) => {
      this.fields = fields.json().body.data.fieldMap;
      this.holidayTypes = fields.json().body.data.fieldMap.holidayTypeId.fieldDataPool.list;
    });
  }

  setSHId(someLabel) {
    if (someLabel.length > 0) {
      this.holidayTypes.forEach((value) => {
        if (value.someLabel === someLabel) {
          this.holyTypeId = value.id;
        }
      });
    }
  }

  // Get Extra Hours Request
  getHrequest() {
    this.reqServe.getHolidayRequest(this.reqId).subscribe((request) => {
      this.request = request.json().body.data;
      this.request.insertDate = this.request.insertDate.split('T')[0];

      this.requestForm.controls['id'].setValue(this.request.id);
      this.requestForm.controls['someLabel'].setValue(this.request.someLabel);
      this.requestForm.controls['insertDate'].setValue(this.request.insertDate);
      this.requestForm.controls['requestTypeId'].setValue(this.request.requestTypeId);
      this.requestForm.controls['holidayTypeId'].setValue(this.request.labelMap.holidayTypeId);
      this.requestForm.controls['employeeId'].setValue(this.request.labelMap.employeeId);
      this.requestForm.controls['startTimestamp'].setValue(this.request.startTimestamp.split('T')[0]);
      this.requestForm.controls['stopTimestamp'].setValue(this.request.stopTimestamp.split('T')[0]);
      this.requestForm.controls['countHD'].setValue(this.request.countHD);
      this.requestForm.controls['employeeNotes'].setValue(this.request.employeeNotes);
      if (this.request.approvementId !== undefined) {
        this.displayApprove = true;
        this.requestForm.controls['approvementId'].setValue(this.request.labelMap.approvementId);
        if (this.request.approvementId === 'POOL00000000044') {
          this.displayAuth = true;
          this.requestForm.controls['authorizationId'].setValue(this.request.labelMap.authorizationId);
        } else if (this.request.approvementId === 'POOL00000000043' && this.request.employeeId === localStorage.getItem('EmpId')) {
          this.isDeletable = true;
        }
      }
      if (this.request.employeeId === localStorage.getItem('EmpId')) {
        this.hasEmployeeField = false;
      }

      this.getEmployeeInfo(this.request.employeeId);
    });
  }

  // Get Employee Info
  getEmployeeInfo(empId: string) {
    this.empServe.getFieldMapEmployee().subscribe((office) => {
      this.offices = office.json().body.data.fieldMap.officeNameId.fieldDataPool.list;
      this.offices.forEach((value) => {
        if (value.id === this.employee.officeNameId) {
          this.requestForm.controls['officeNameId'].setValue(value.someLabel);
          this.OfficeId = value.id;
        }
      });
    });
    this.empServe.getEmployee(empId).subscribe((managerNdirector) => {
      this.employee = managerNdirector.json().body.data;
      this.requestForm.controls['managerId'].setValue(this.employee.managerFirstName + ' ' + this.employee.managerLastName);
      this.requestForm.controls['directorId'].setValue(this.employee.directorFirstName + ' ' + this.employee.directorLastName);
      this.ManagerId = this.employee.managerId;
      this.DirectorId = this.employee.directorId;
      if (this.employee.managerId === localStorage.getItem('EmpId') && this.request.approvementId === 'POOL00000000043') {
        this.isManager = true;
      }
      if (this.employee.directorId === localStorage.getItem('EmpId') && this.request.approvementId === 'POOL00000000044') {
        this.isDirector = true;
      }
    });
  }

  // EXTRA_HOURS_REQUEST_CRUD---------------------------------------------------------------------------------------------------------------

  // Insert New Request
  insertRequest() {
    this.request = this.requestForm.value;
    this.request.holidayTypeId = this.holyTypeId;
    this.request.officeNameId = this.OfficeId;
    this.request.managerId = this.ManagerId;
    this.request.directorId = this.DirectorId;
    this.request.startTimestamp = this.request.startTimestamp + 'T00:00:00';
    this.request.stopTimestamp = this.request.stopTimestamp + 'T00:00:00';

    this.reqServe.insertHolidaysRequest(this.request).subscribe(
      (status) => {
        if (status.json().status.code === 'STATUS_OK') {
          this.chip.open('Holiday request is sent successfully!', null, {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            panelClass: ['success-chip']
          });
          this.loc.back();
        }
      },
      () => {
        this.chip.open('Holiday request isn\'t sent, sorry!', null, {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'left',
          panelClass: ['error-chip']
        });
        this.reset();
      }
    );
  }

  // delete pending request
  deleteRequest() {
    const confText = 'Are you sure that you want to delete this pending holiday request ?';
    const confType = 'del';
    const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {text: confText, conf: confType, type: confType}
    });
    confDlg.afterClosed().subscribe((resuelt) => {
      this.confirmation = resuelt;
      if (this.confirmation === true) {
        this.reqServe.deleteHolidayRequest(this.reqId).subscribe(
          (status) => {
            if (status.json().status.code === 'STATUS_OK') {
              this.chip.open('Holiday request is deleted successfully!', null, {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'left',
                panelClass: ['success-chip']
              });
              this.loc.back();
            }
          },
          () => {
            this.chip.open('Holiday request can\'t be deleted, sorry!', null, {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'left',
              panelClass: ['error-chip']
            });
          }
        );
      } else {
        this.loc.back();
      }
    });
  }

  // Reset Request Form
  reset() {
    this.requestForm.controls['stopTimestamp'].setValue('');
    this.requestForm.controls['startTimestamp'].setValue('');
    this.requestForm.controls['countHD'].setValue('');
    this.requestForm.controls['employeeNotes'].setValue('');
  }

  // approve or deny request
  approveOrDeny(type: number) {
    const confType = 'manager';
    if (type === 1) {
      const confText = 'Are you shure that you want to approve this request ?';
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result.split('|')[0] === 'true') {
          this.reqServe.managerNdirectorDecisionHolidayRequest('approve', this.reqId, result.split('|')[1]).subscribe(
            (response) => {
              if (response.json().status.code === 'STATUS_OK') {
                this.chip.open('Holiday request is APPROVED!', null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['success-chip']
                });
                this.loc.back();
              }
            },
            () => {
              this.chip.open('Error, holiday request isn\'t approved!', null, {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'left',
                panelClass: ['error-chip']
              });
            }
          );
        }
      });
    } else {
      const confText = 'Are you shure that you want to deny this request ?';
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe(
        (result) => {
          if (result.split('|')[0] === 'true') {
            this.reqServe.managerNdirectorDecisionHolidayRequest('deny', this.reqId, result.split('|')[1]).subscribe(
              (response) => {
                if (response.json().status.code === 'STATUS_OK') {
                  this.chip.open('Holiday request is DENIED!', null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['success-chip']
                  });
                  this.loc.back();
                }
              },
              () => {
                this.chip.open('Error, holiday request isn\'t denied!', null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['error-chip']
                });
              }
            );
          }
        }
      );
    }
  }

  // authorize or not request
  authorizeOrNotAuthorize(type: number) {
    const confType = 'director';
    if (type === 1) {
      const confText = 'Are you sure that you want to authorize this request ?';
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result.split('|')[0] === 'true') {
          this.reqServe.managerNdirectorDecisionHolidayRequest(
            'authorize', this.reqId, result.split('|')[1]
          ).subscribe(
            (response) => {
              if (response.json().status.code === 'STATUS_OK') {
                this.chip.open('Holiday request is AUTHORIZED!', null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['success-chip']
                });
                this.loc.back();
              }
            },
            () => {
              this.chip.open('Error, holiday request isn\'t authorized!', null, {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'left',
                panelClass: ['error-chip']
              });
            }
          );
        }
      });
    } else {
      const confText = 'Are you sure that you want to authorize this request ?';
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result.split('|')[0] === 'true') {
          this.reqServe.managerNdirectorDecisionHolidayRequest(
            'authorize', this.reqId, result.split('|')[1]
          ).subscribe(
            (response) => {
              if (response.json().status.code === 'STATUS_OK') {
                this.chip.open('Holiday request is NOT AUTHORIZED!', null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['success-chip']
                });
                this.loc.back();
              }
            },
            () => {
              this.chip.open('Error while not authorizing this request!', null, {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'left',
                panelClass: ['error-chip']
              });
            }
          );
        }
      });
    }
  }
}
