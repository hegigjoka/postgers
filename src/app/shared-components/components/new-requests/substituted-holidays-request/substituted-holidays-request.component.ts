import { Component, OnInit } from '@angular/core';
import {RequestsService} from '../../../providers/requests.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';
import {RequestSubstituteModel} from '../../../models/requests-models/request-substitute.model';
import {RequestSubstituteMetadata} from '../../../models/requests-models/request-substitute-metadata';
import {PersonelRequestService} from '../../../providers/personel-request.service';
import {HrPermission} from '../../../permissions/hr-permission';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-substituted-holidays-request',
  templateUrl: './substituted-holidays-request.component.html',
  styleUrls: ['../new-request.components.css']
})
export class SubstitutedHolidaysRequestComponent implements OnInit {
  // component name
  cn = {requestType: ''};

  fields: RequestSubstituteMetadata;

  reqId: string;
  request: RequestSubstituteModel;

  requestForm: FormGroup;
  date: Date = new Date();
  dtbsub: string;
  subDates = [' '];
  addSubDates = 0;
  hideButton: boolean;

  hasSomeField: boolean;
  hasEmployeeField: boolean;
  proc: boolean;
  isDeletable: boolean;
  isManager: boolean;
  displayApprove: boolean;
  isDirector: boolean;
  displayAuth: boolean;
  confirmation: boolean;

  allowUpdateRequest: boolean;
  allowDeleteRequest: boolean;

  constructor(
    private translate: TranslateService,
    public permissions: HrPermission,
    private persReqServe: PersonelRequestService,
    private reqServe: RequestsService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmDialog: MatDialog,
    public chip: MatSnackBar,
    private loc: Location
  ) { }

  ngOnInit() {
    this.cn.requestType = this.translate.instant('SH_header');
    setTimeout(() => {
      this.getFields();
      if (this.permissions.hrRequestsType.allowPut === true) {
        this.allowUpdateRequest = true;
      }
      if (this.permissions.hrRequestsType.allowDelete === true) {
        this.allowDeleteRequest = true;
      }
    }, 600);
    const insertDate = new Date(this.date.valueOf() + 3600000);
    this.requestForm = new FormGroup({
      id: new FormControl(''),
      someLabel: new FormControl(''),
      insertDate: new FormControl(insertDate.toISOString().split('.')[0], Validators.required),
      requestTypeId: new FormControl('POOL00000000082', Validators.required),
      employeeId: new FormControl(this.permissions.employee.fullName, Validators.required),
      officeNameId: new FormControl(''),
      managerId: new FormControl(''),
      directorId: new FormControl(''),
      date: new FormControl('', [Validators.required, this.dateVal.bind(this)]),
      startTimestamp: new FormControl('', Validators.required),
      stopTimestamp: new FormControl('', Validators.required),
      countHD: new FormControl(null, Validators.required),
      substitutionDates: new FormControl(''),
      subDate0: new FormControl('', [Validators.required, this.subDateVal.bind(this)]),
      subDate1: new FormControl('', this.subDateVal.bind(this)),
      subDate2: new FormControl('', this.subDateVal.bind(this)),
      employeeNotes: new FormControl(''),
      approvementId: new FormControl(''),
      authorizationId: new FormControl(''),
      labelMap: new FormGroup({})
    });
    this.getUrlParams();
  }

  dateVal(control: FormControl): {[key: string]: boolean} {
    if (control.value < this.date.toISOString().split('T')[0]) {
      return {'incorrect date': true};
    }
    return null;
  }

  subDateVal(control: FormControl): {[key: string]: boolean} {
    if (control.value <= this.dtbsub) {
      return {'incorrect sub date 0': true};
    }
    return null;
  }

  getUrlParams() {
    this.route.params.subscribe((requestId: Params) => {
      this.reqId = requestId['reqId'];
    });
    if (this.reqId === 'new') {
      this.hasSomeField = false;
      this.hasEmployeeField = false;
    } else {
      this.hideButton = true;
      this.hasSomeField = true;
      this.hasEmployeeField = true;
      this.requestForm.disable();
      setTimeout(() => {
        this.getSHrequest();
      }, 600);
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
      this.requestForm.controls['officeNameId'].setValue(this.request.labelMap.officeNameId);
      this.requestForm.controls['managerId'].setValue(this.request.labelMap.managerId);
      this.requestForm.controls['directorId'].setValue(this.request.labelMap.directorId);
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
          if (this.router.url.match(/\/hr\/request-management/) && this.request.processedId === 'POOL00000000088') {
            this.proc = true;
          }
        } else if (this.request.approvementId === 'POOL00000000043' && this.request.employeeId === this.permissions.employee.id) {
          this.isDeletable = true;
        }
      }

      if (this.request.employeeId === this.permissions.employee.id) {
        this.hasEmployeeField = false;
      }
      if (this.permissions.employee.id === this.request.managerId && this.request.approvementId === 'POOL00000000043') {
        this.isManager = true;
      }
      if (this.permissions.employee.id === this.request.directorId && this.request.authorizationId !== 'POOL00000000041') {
        this.isManager = false;
        this.isDirector = true;
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
        this.hideButton = true;
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

    this.reqServe.insertSubHolyRequest(this.request).subscribe(
      (status) => {
        if (status.json().status.code === 'STATUS_OK') {
          this.chip.open(this.translate.instant('requests_insert_tag', this.cn), null, {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            panelClass: ['success-chip']
          });
          this.loc.back();
        } else {
          this.chip.open(this.translate.instant('requests_not_insert_tag', this.cn), null, {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            panelClass: ['error-chip']
          });
          this.reset();
        }
      },
      () => {
        this.chip.open(this.translate.instant('requests_not_insert_tag', this.cn), null, {
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
    const confText = this.translate.instant('delete_conf', this.cn);
    const confType = 'del';
    const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {text: confText, conf: confType, type: confType}
    });
    confDlg.afterClosed().subscribe((resuelt) => {
      if (resuelt !== undefined) {
        if (resuelt === true) {
          this.reqServe.deleteSubHolyRequest(this.reqId).subscribe(
            (status) => {
              if (status.json().status.code === 'STATUS_OK') {
                this.chip.open(this.translate.instant('requests_delete_tag', this.cn), null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['success-chip']
                });
                this.loc.back();
              } else {
                this.chip.open(this.translate.instant('requests_not_delete_tag', this.cn), null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['error-chip']
                });
              }
            },
            () => {
              this.chip.open(this.translate.instant('requests_not_delete_tag', this.cn), null, {
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
      }
    });
  }

  // Reset Request Form
  reset() {
    this.requestForm.controls['date'].setValue('');
    this.requestForm.controls['stopTimestamp'].setValue('');
    this.requestForm.controls['startTimestamp'].setValue('');
    this.requestForm.controls['countHD'].setValue('');
    this.requestForm.controls['subDate0'].setValue('');
    this.requestForm.controls['subDate1'].setValue('');
    this.requestForm.controls['subDate2'].setValue('');
    this.requestForm.controls['employeeNotes'].setValue('');
  }

  // approve or deny request
  approveOrDeny(type: number) {
    const confType = 'manager';
    if (type === 1) {
      const confText = this.translate.instant('approve_conf', this.cn);
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          if (result.split('|')[0] === 'true') {
            this.reqServe.managerNdirectorDecisionSubHolyRequest('approve', this.reqId, result.split('|')[1]).subscribe(
              (response) => {
                if (response.json().status.code === 'STATUS_OK') {
                  this.chip.open(this.translate.instant('requests_approve_tag', this.cn), null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['success-chip']
                  });
                  this.loc.back();
                } else {
                  this.chip.open(this.translate.instant('requests_not_approve_tag', this.cn), null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['error-chip']
                  });
                }
              },
              () => {
                this.chip.open(this.translate.instant('requests_not_approve_tag', this.cn), null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['error-chip']
                });
              }
            );
          }
        }
      });
    } else {
      const confText = this.translate.instant('deny_conf', this.cn);
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe(
        (result) => {
          if (result !== undefined) {
            if (result.split('|')[0] === 'true') {
              this.reqServe.managerNdirectorDecisionSubHolyRequest('deny', this.reqId, result.split('|')[1]).subscribe(
                (response) => {
                  if (response.json().status.code === 'STATUS_OK') {
                    this.chip.open(this.translate.instant('requests_deny_tag', this.cn), null, {
                      duration: 5000,
                      verticalPosition: 'bottom',
                      horizontalPosition: 'left',
                      panelClass: ['success-chip']
                    });
                    this.loc.back();
                  } else {
                    this.chip.open(this.translate.instant('requests_not_deny_tag', this.cn), null, {
                      duration: 5000,
                      verticalPosition: 'bottom',
                      horizontalPosition: 'left',
                      panelClass: ['error-chip']
                    });
                  }
                },
                () => {
                  this.chip.open(this.translate.instant('requests_not_deny_tag', this.cn), null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['error-chip']
                  });
                }
              );
            }
          }
        }
      );
    }
  }

  // authorize or not request
  authorizeOrNotAuthorize(type: number) {
    const confType = 'director';
    if (type === 1) {
      const confText = this.translate.instant('authorize_conf', this.cn);
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          if (result.split('|')[0] === 'true') {
            this.reqServe.managerNdirectorDecisionSubHolyRequest('authorize', this.reqId, result.split('|')[1]).subscribe(
              (response) => {
                if (response.json().status.code === 'STATUS_OK') {
                  this.chip.open(this.translate.instant('requests_authorize_tag', this.cn), null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['success-chip']
                  });
                  this.loc.back();
                } else {
                  this.chip.open(this.translate.instant('requests_not_authorize_tag', this.cn), null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['error-chip']
                  });
                }
              },
              () => {
                this.chip.open(this.translate.instant('requests_not_authorize_tag', this.cn), null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['error-chip']
                });
              }
            );
          }
        }
      });
    } else {
      const confText = this.translate.instant('not_authorize_conf', this.cn);
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          if (result.split('|')[0] === 'true') {
            this.reqServe.managerNdirectorDecisionSubHolyRequest('notAuthorize', this.reqId, result.split('|')[1]).subscribe(
              (response) => {
                if (response.json().status.code === 'STATUS_OK') {
                  this.chip.open(this.translate.instant('requests_not_auth_tag', this.cn), null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['success-chip']
                  });
                  this.loc.back();
                } else {
                  this.chip.open(this.translate.instant('requests_error_not_authorize_tag', this.cn), null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['error-chip']
                  });
                }
              },
              () => {
                this.chip.open(this.translate.instant('requests_error_not_authorize_tag', this.cn), null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['error-chip']
                });
              }
            );
          }
        }
      });
    }
  }

  // process auth requests
  procReq (type: number) {
    const confType = 'hrOffice';
    if (type === 1) {
      const confText = this.translate.instant('process_conf', this.cn);
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          if (result === true) {
            this.persReqServe.patchPersonelRequests(this.reqId, 'substitutions', 'POOL00000000090').subscribe(
              (response) => {
                if (response.json().status.code === 'STATUS_OK') {
                  this.chip.open(this.translate.instant('requests_process_tag', this.cn), null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['success-chip']
                  });
                  this.loc.back();
                } else {
                  this.chip.open(this.translate.instant('requests_not_process_tag', this.cn), null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['error-chip']
                  });
                }
              },
              () => {
                this.chip.open(this.translate.instant('requests_not_process_tag', this.cn), null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['error-chip']
                });
              }
            );
          }
        }
      });
    } else {
      const confText = this.translate.instant('decline_conf', this.cn);
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          if (result === true) {
            this.persReqServe.patchPersonelRequests(this.reqId, 'substitutions', 'POOL00000000089').subscribe(
              (response) => {
                if (response.json().status.code === 'STATUS_OK') {
                  this.chip.open(this.translate.instant('requests_decline_tag', this.cn), null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['success-chip']
                  });
                  this.loc.back();
                } else {
                  this.chip.open(this.translate.instant('requests_not_decline_tag', this.cn), null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['error-chip']
                  });
                }
              },
              () => {
                this.chip.open(this.translate.instant('requests_not_decline_tag', this.cn), null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['error-chip']
                });
              }
            );
          }
        }
      });
    }
  }
}
