import { Component, OnInit } from '@angular/core';
import {RequestsService} from '../../../providers/requests.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AbstractModel} from '../../../models/shared-models/abstract.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';
import {RequestMissionMetadata} from '../../../models/requests-models/request-mission-metadata';
import {RequestMissionModel} from '../../../models/requests-models/request-mission.model';
import {PersonelRequestService} from '../../../providers/personel-request.service';
import {HrPermission} from '../../../permissions/hr-permission';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mission-request',
  templateUrl: './mission-request.component.html',
  styleUrls: ['../new-request.components.css']
})
export class MissionRequestComponent implements OnInit {
  // component name
  cn = {requestType: ''};

  fields: RequestMissionMetadata;

  missionTypes: AbstractModel[];
  missionTypeInput: string;
  missionTypeId: string;

  reqId: string;
  request: RequestMissionModel;

  requestForm: FormGroup;
  date: Date = new Date();
  startDate: string;
  startTime: string;

  hasSomeField: boolean;
  hasEmployeeField: boolean;
  proc: boolean;
  isDeletable: boolean;
  isManager: boolean;
  displayApprove: boolean;
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
    this.cn.requestType = this.translate.instant('M_header');
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
      requestTypeId: new FormControl('POOL00000000078', Validators.required),
      missionTypeId: new FormControl('Conference', Validators.required),
      missionWhere: new FormControl(''),
      employeeId: new FormControl(this.permissions.employee.fullName, Validators.required),
      officeNameId: new FormControl(''),
      managerId: new FormControl(''),
      directorId: new FormControl(''),
      startTimestamp: new FormControl(''),
      startDate: new FormControl(insertDate.toISOString().split('T')[0], [Validators.required, this.startDateVal.bind(this)]),
      startTime: new FormControl(insertDate.toISOString().split('T')[1].substr(0, 5), [Validators.required, this.startTimeVal.bind(this)]),
      stopTimestamp: new FormControl(''),
      stopDate: new FormControl('', [Validators.required, this.stopDateVal.bind(this)]),
      stopTime: new FormControl('', [Validators.required, this.stopTimeVal.bind(this)]),
      approvementId: new FormControl(''),
      labelMap: new FormGroup({
        requestTypeId: new FormControl('Mission'),
        employeeId: new FormControl(localStorage.getItem('EmpFullName')),
        approvementId: new FormControl('Pending')
      })
    });
    this.getUrlParams();
  }

  startDateVal(control: FormControl): {[key: string]: boolean} {
    if (control.value < this.date.toISOString().split('T')[0]){
      return {'incorrect start date': true};
    }
    return null;
  }
  startTimeVal(control: FormControl): {[key: string]: boolean} {
    if (this.startDate === this.date.toISOString().split('T')[0] && control.value < this.date.toISOString().split('T')[1].substr(0, 5)) {
      return {'incorrect start time': true};
    }
    return null;
  }
  stopDateVal(control: FormControl): {[key: string]: boolean} {
    if (this.startDate > control.value){
      return {'incorrect stop date': true};
    }
    return null;
  }
  stopTimeVal(control: FormControl): {[key: string]: boolean} {
    if (this.startTime >= control.value) {
      return {'incorrect stop time': true};
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
      this.hasSomeField = true;
      this.hasEmployeeField = true;
      this.requestForm.disable();
      setTimeout(() => {
        this.getMrequest();
      }, 600);
    }
  }

  getFields() {
    this.reqServe.getTableOptions('mission').subscribe((fields) => {
      this.fields = fields.json().body.data.fieldMap;
      this.missionTypes = fields.json().body.data.fieldMap.missionTypeId.fieldDataPool.list;
    });
  }

  setMTId(someLabel) {
    if (someLabel.length > 0) {
      this.missionTypes.forEach((value) => {
        if (value.someLabel === someLabel) {
          this.missionTypeId = value.id;
        }
      });
    }
  }

  // Get Mission Request
  getMrequest() {
    this.reqServe.getMissionRequest(this.reqId).subscribe((request) => {
      this.request = request.json().body.data;
      this.request.insertDate = this.request.insertDate.split('T')[0];

      this.requestForm.controls['id'].setValue(this.request.id);
      this.requestForm.controls['someLabel'].setValue(this.request.someLabel);
      this.requestForm.controls['insertDate'].setValue(this.request.insertDate);
      this.requestForm.controls['requestTypeId'].setValue(this.request.requestTypeId);
      this.requestForm.controls['missionTypeId'].setValue(this.request.labelMap.missionTypeId);
      this.requestForm.controls['missionWhere'].setValue(this.request.missionWhere);
      this.requestForm.controls['employeeId'].setValue(this.request.labelMap.employeeId);
      this.requestForm.controls['officeNameId'].setValue(this.request.labelMap.officeNameId);
      this.requestForm.controls['managerId'].setValue(this.request.labelMap.managerId);
      this.requestForm.controls['startTimestamp'].setValue(this.request.startTimestamp);
      this.requestForm.controls['startDate'].setValue(this.request.startTimestamp.split('T')[0]);
      this.requestForm.controls['startTime'].setValue(this.request.startTimestamp.split('T')[1].substr(0, 5));
      this.requestForm.controls['stopTimestamp'].setValue(this.request.stopTimestamp);
      this.requestForm.controls['stopDate'].setValue(this.request.stopTimestamp.split('T')[0]);
      this.requestForm.controls['stopTime'].setValue(this.request.stopTimestamp.split('T')[1].substr(0, 5));

      if (this.request.approvementId !== undefined) {
        this.displayApprove = true;
        this.requestForm.controls['approvementId'].setValue(this.request.labelMap.approvementId);
        if (this.request.authorizationId === 'POOL00000000041' && this.router.url.match(/\/hr\/request-management/) && this.request.processedId === 'POOL00000000088') {
          this.proc = true;
        }
        if (this.request.approvementId === 'POOL00000000043' && this.request.employeeId === this.permissions.employee.id) {
          this.isDeletable = true;
        }
      }

      if (this.request.employeeId === this.permissions.employee.id) {
        this.hasEmployeeField = false;
      }
      if (this.permissions.employee.id === this.request.managerId && this.request.approvementId === 'POOL00000000043') {
        this.isManager = true;
      }
    });
  }

  // EXTRA_HOURS_REQUEST_CRUD---------------------------------------------------------------------------------------------------------------

  // Insert New Request
  insertRequest() {
    this.requestForm.controls['startTimestamp'].setValue(
      this.requestForm.controls['startDate'].value + 'T' + this.requestForm.controls['startTime'].value + ':00'
    );
    this.requestForm.controls['stopTimestamp'].setValue(
      this.requestForm.controls['stopDate'].value + 'T' + this.requestForm.controls['stopTime'].value + ':00'
    );

    this.request = this.requestForm.value;
    this.request.missionTypeId = this.missionTypeId;

    this.reqServe.insertMissionRequest(this.request).subscribe(
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
    confDlg.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (result === true) {
          this.reqServe.deleteMissionRequest(this.reqId).subscribe(
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
    this.requestForm.controls['missionTypeId'].setValue('');
    this.requestForm.controls['missionWhere'].setValue('');
    this.requestForm.controls['startDate'].setValue('');
    this.requestForm.controls['startTime'].setValue('');
    this.requestForm.controls['stopDate'].setValue('');
    this.requestForm.controls['stopTime'].setValue('');
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
            this.reqServe.managerNdirectorDecisionMissionRequest('approve', this.reqId, result.split('|')[1]).subscribe(
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
              this.reqServe.managerNdirectorDecisionMissionRequest('deny', this.reqId, result.split('|')[1]).subscribe(
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

  // process auth request
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
            this.persReqServe.patchPersonelRequests(this.reqId, 'missions', 'POOL00000000090').subscribe(
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
            this.persReqServe.patchPersonelRequests(this.reqId, 'missions', 'POOL00000000089').subscribe(
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
