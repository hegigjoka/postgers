import { Component, OnInit } from '@angular/core';
import {RequestsService} from '../../../providers/requests.service';
import {ActivatedRoute, Params} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EmployeeModel} from '../../../models/employee-models/employee.model';
import {EmployeeService} from '../../../providers/employee.service';
import {AbstractModel} from '../../../models/shared-models/abstract.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';
import {RequestSubstituteModel} from '../../../models/requests-models/request-substitute.model';
import {RequestSubstituteMetadata} from '../../../models/requests-models/request-substitute-metadata';

@Component({
  selector: 'app-substituted-holidays-request',
  templateUrl: './substituted-holidays-request.component.html',
  styleUrls: ['../new-request.components.css']
})
export class SubstitutedHolidaysRequestComponent implements OnInit {
  fields: RequestSubstituteMetadata;

  reqId: string;
  request: RequestSubstituteModel;

  employee: EmployeeModel;
  offices: AbstractModel[];
  requestForm: FormGroup;
  date: Date = new Date();
  subDates = [' '];
  addSubDates = 0;
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
      holidayTypeId: new FormControl('Hours for Permission (paid)', Validators.required),
      employeeId: new FormControl(localStorage.getItem('EmpId'), Validators.required),
      officeNameId: new FormControl('', Validators.required),
      managerId: new FormControl('', Validators.required),
      directorId: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      startTimestamp: new FormControl('', Validators.required),
      stopTimestamp: new FormControl('', Validators.required),
      countHD: new FormControl(0, Validators.required),
      substitutionDates: new FormControl(''),
      subDate0: new FormControl(''),
      subDate1: new FormControl(''),
      subDate2: new FormControl(''),
      employeeNotes: new FormControl('No notes...'),
      approvementId: new FormControl(''),
      authorizationId: new FormControl(''),
      labelMap: new FormGroup({})
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
      this.getSHrequest();
    }
  }

  getFields() {
    this.reqServe.getTableOptions('subHoly').subscribe((fields) => {
      this.fields = fields.json().body.data.fieldMap;
    });
  }

  // Get Extra Hours Request
  getSHrequest() {
    this.reqServe.getSubHolyRequest(this.reqId).subscribe((request) => {
      // get request
      this.request = request.json().body.data;
      this.request.insertDate = this.request.insertDate.split('T')[0];
      // insert request to te form
      this.requestForm.controls['id'].setValue(this.request.id);
      this.requestForm.controls['someLabel'].setValue(this.request.someLabel);
      this.requestForm.controls['insertDate'].setValue(this.request.insertDate);
      this.requestForm.controls['requestTypeId'].setValue(this.request.requestTypeId);
      this.requestForm.controls['employeeId'].setValue(this.request.labelMap.employeeId);
      this.requestForm.controls['date'].setValue(this.request.startTimestamp.split('T')[0]);
      this.requestForm.controls['startTimestamp'].setValue(this.request.startTimestamp.split('T')[1].substr(0, 5));
      this.requestForm.controls['stopTimestamp'].setValue(this.request.stopTimestamp.split('T')[1].substr(0, 5));
      this.requestForm.controls['employeeNotes'].setValue(this.request.employeeNotes);
      this.requestForm.controls['countHD'].setValue(this.request.countHD);
      // insert substitution dates to the form
      if (this.request.substitutionDates !== undefined) {
        let i = 0;
        this.subDates = [];
        this.request.substitutionDates.forEach((value) => {
          const label = 'subDate' + i;
          this.subDates.push(value);
          this.requestForm.controls[label].setValue(value.split('T')[0]);
          i++;
        });
      }
      // show approvement or authorization to the form
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
        if (this.request.authorizationId === 'POOL00000000041') {
          this.isDeletable = false;
          this.isManager = false;
          this.isDirector = false;
        }
      }
    });
  }

  newDate() {
    if (this.subDates.length < 3) {
      const label = 'subDate' + this.addSubDates;
      if (this.requestForm.controls[label].value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)) {
        this.subDates.push(' ');
        this.addSubDates++;
      }
      if (this.addSubDates === 2) {
        this.hasSomeField = true;
      }
    }
  }

  // SUBSTITUTED_HOLIDAYS_REQUEST_CRUD------------------------------------------------------------------------------------------------------

  // Insert New Request
  insertRequest() {
    let i = 0;
    this.subDates.forEach(() => {
      const label = 'subDate' + i;
      this.subDates[i] = this.requestForm.controls[label].value + 'T00:00:00';
      i++;
    });
    this.requestForm.controls['substitutionDates'].setValue(this.subDates);
    this.requestForm.controls['startTimestamp'].setValue(
      this.requestForm.controls['date'].value + 'T' + this.requestForm.controls['startTimestamp'].value + ':00'
    );
    this.requestForm.controls['stopTimestamp'].setValue(
      this.requestForm.controls['date'].value + 'T' + this.requestForm.controls['stopTimestamp'].value + ':00'
    );
    this.request = this.requestForm.value;
    this.request.officeNameId = this.OfficeId;
    this.request.managerId = this.ManagerId;
    this.request.directorId = this.DirectorId;
    console.log(this.request);

    this.reqServe.insertSubHolyRequest(this.request).subscribe(
      (status) => {
        if (status.json().status.code === 'STATUS_OK') {
          this.chip.open('Substituted Holidays request is sent successfully!', null, {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            panelClass: ['success-chip']
          });
          this.loc.back();
        }
      },
      () => {
        this.chip.open('Substituted Holidays request isn\'t sent, sorry!', null, {
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
    const confText = 'Are you sure that you want to delete this pending substituted holidays request ?';
    const confType = 'del';
    const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {text: confText, conf: confType, type: confType}
    });
    confDlg.afterClosed().subscribe((resuelt) => {
      this.confirmation = resuelt;
      if (this.confirmation === true) {
        this.reqServe.deleteSubHolyRequest(this.reqId).subscribe(
          (status) => {
            if (status.json().status.code === 'STATUS_OK') {
              this.chip.open('Substituted Holidays request is deleted successfully!', null, {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'left',
                panelClass: ['success-chip']
              });
              this.loc.back();
            }
          },
          () => {
            this.chip.open('Substituted Holidays request can\'t be deleted, sorry!', null, {
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
      const confText = 'Are you shure that you want to APPROVE this request ?';
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result.split('|')[0] === 'true') {
          this.reqServe.managerNdirectorDecisionSubHolyRequest('approve', this.reqId, result.split('|')[1]).subscribe(
            (response) => {
              if (response.json().status.code === 'STATUS_OK') {
                this.chip.open('Substituted Holidays request is APPROVED!', null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['success-chip']
                });
                this.loc.back();
              }
            },
            () => {
              this.chip.open('Error, substituted holidays request isn\'t approved!', null, {
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
      const confText = 'Are you shure that you want to DENY this request ?';
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe(
        (result) => {
          if (result.split('|')[0] === 'true') {
            this.reqServe.managerNdirectorDecisionSubHolyRequest('deny', this.reqId, result.split('|')[1]).subscribe(
              (response) => {
                if (response.json().status.code === 'STATUS_OK') {
                  this.chip.open('Substituted Holidays request is DENIED!', null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['success-chip']
                  });
                  this.loc.back();
                }
              },
              () => {
                this.chip.open('Error, substituted holidays request isn\'t denied!', null, {
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
      const confText = 'Are you sure that you want to AUTHORIZE this request ?';
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result.split('|')[0] === 'true') {
          this.reqServe.managerNdirectorDecisionSubHolyRequest('authorize', this.reqId, result.split('|')[1]).subscribe(
            (response) => {
              if (response.json().status.code === 'STATUS_OK') {
                this.chip.open('Substituted Holidays request is AUTHORIZED!', null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['success-chip']
                });
                this.loc.back();
              }
            },
            () => {
              this.chip.open('Error, substituted holidays request isn\'t authorized!', null, {
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
      const confText = 'Are you sure that you want to NOT AUTHORIZE this request ?';
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result.split('|')[0] === 'true') {
          this.reqServe.managerNdirectorDecisionSubHolyRequest('notAuthorize', this.reqId, result.split('|')[1]).subscribe(
            (response) => {
              if (response.json().status.code === 'STATUS_OK') {
                this.chip.open('Substituted Holidays request is NOT AUTHORIZED!', null, {
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
