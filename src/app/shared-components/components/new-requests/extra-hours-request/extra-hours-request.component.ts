import { Component, OnInit } from '@angular/core';
import {RequestExtraHoursMetadata} from '../../../models/requests-models/request-extra-hours-metadata';
import {RequestsService} from '../../../providers/requests.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RequestExtraHoursModel} from '../../../models/requests-models/request-extra-hours.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EmployeeModel} from '../../../models/employee-models/employee.model';
import {EmployeeService} from '../../../providers/employee.service';
import {AbstractModel} from '../../../models/shared-models/abstract.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';
import {PersonelRequestService} from '../../../providers/personel-request.service';

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
  proc: boolean;
  isDeletable: boolean;
  isManager: boolean;
  displayApprove: boolean;
  isDirector: boolean;
  displayAuth: boolean;
  confirmation: boolean;

  constructor(
    private persReqServe: PersonelRequestService,
    private reqServe: RequestsService,
    private empServe: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmDialog: MatDialog,
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
      if (this.request.approvementId !== undefined) {
        this.displayApprove = true;
        this.requestForm.controls['approvementId'].setValue(this.request.labelMap.approvementId);
        if (this.request.approvementId === 'POOL00000000044' && this.request.authorizationId === 'POOL00000000041') {
          this.displayAuth = true;
          this.requestForm.controls['authorizationId'].setValue(this.request.labelMap.authorizationId);
          if (this.router.url.match(/\/hr\/request-management/)) {
            this.proc = true;
          }
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
    this.empServe.getEmployee(empId).subscribe((managerNdirectorNoffice) => {
      this.employee = managerNdirectorNoffice.json().body.data;
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

  // EXTRA_HOURS_REQUEST_CRUD---------------------------------------------------------------------------------------------------------------

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

  // delete pending request
  deleteRequest() {
    const confText = 'Are you sure that you want to delete this pending extra hours request ?';
    const confType = 'del';
    const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {text: confText, conf: confType, type: confType}
    });
    confDlg.afterClosed().subscribe((resuelt) => {
      this.confirmation = resuelt;
      if (this.confirmation === true) {
        this.reqServe.deleteExtraHoursRequest(this.reqId).subscribe(
          (status) => {
            if (status.json().status.code === 'STATUS_OK') {
              this.chip.open('Extra hour request is deleted successfully!', null, {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'left',
                panelClass: ['success-chip']
              });
              this.loc.back();
            }
          },
          () => {
            this.chip.open('Extra hour request can\'t be deleted, sorry!', null, {
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
    this.requestForm.controls['date'].setValue('');
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
          this.reqServe.managerNdirectorDecisionExtraHoursRequest('approve', this.reqId, result.split('|')[1]).subscribe(
            (response) => {
              if (response.json().status.code === 'STATUS_OK') {
                this.chip.open('Extra hour request is APPROVED!', null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['success-chip']
                });
                this.loc.back();
              }
            },
            () => {
              this.chip.open('Error, extra hours request isn\'t approved!', null, {
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
            this.reqServe.managerNdirectorDecisionExtraHoursRequest('deny', this.reqId, result.split('|')[1]).subscribe(
              (response) => {
                if (response.json().status.code === 'STATUS_OK') {
                  this.chip.open('Extra hour request is DENIED!', null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['success-chip']
                  });
                  this.loc.back();
                }
              },
              () => {
                this.chip.open('Error, extra hours request isn\'t denied!', null, {
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
    let confType = 'xHdirector';
    if (type === 1) {
      const confText = 'Are you sure that you want to AUTHORIZE this request ?';
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result.split('|')[0] === 'true') {
          this.reqServe.managerNdirectorDecisionExtraHoursRequest(
            'authorize', this.reqId, result.split('|')[1], result.split('|')[2]
          ).subscribe(
            (response) => {
              if (response.json().status.code === 'STATUS_OK') {
                this.chip.open('Extra hour request is AUTHORIZED!', null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['success-chip']
                });
                this.loc.back();
              }
            },
            () => {
              this.chip.open('Error, extra hours request isn\'t authorized!', null, {
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
      confType = 'director';
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result.split('|')[0] === 'true') {
          this.reqServe.managerNdirectorDecisionExtraHoursRequest(
            'notAuthorize', this.reqId, result.split('|')[1], result.split('|')[2]
          ).subscribe(
            (response) => {
              if (response.json().status.code === 'STATUS_OK') {
                this.chip.open('Extra hour request is NOT AUTHORIZED!', null, {
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

  procReq (type: number) {
    const confType = 'hrOffice';
    if (type === 1) {
      const confText = 'Are you sure to PROCESS this extra hours request ?';
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result === true) {
          this.persReqServe.patchPersonelRequests(this.reqId, 'POOL00000000090').subscribe(
            (response) => {
              if (response.json().status.code === 'STATUS_OK') {
                this.chip.open('Request processed successfully!', null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['success-chip']
                });
                this.loc.back();
              }
            },
            () => {
              this.chip.open('Request isn\'t processed successfully!', null, {
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
      const confText = 'Are you sure to DECLINE this extra hours request ?';
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result === true) {
          this.persReqServe.patchPersonelRequests(this.reqId, 'POOL00000000089').subscribe(
            (response) => {
              if (response.json().status.code === 'STATUS_OK') {
                this.chip.open('Request declined successfully!', null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['success-chip']
                });
                this.loc.back();
              }
            },
            () => {
              this.chip.open('Request isn\'t declined successfully!', null, {
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
