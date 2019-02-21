import { Component, OnInit } from '@angular/core';
import {RequestsService} from '../../../providers/requests.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AbstractModel} from '../../../models/shared-models/abstract.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';
import {RequestMissingBadgeMetadata} from '../../../models/requests-models/request-missing-badge-metadata';
import {RequestMissingBadgeModel} from '../../../models/requests-models/request-missing-badge.model';
import {PersonelRequestService} from '../../../providers/personel-request.service';
import {HrPermission} from '../../../permissions/hr-permission';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-badge-fail-request',
  templateUrl: './badge-fail-request.component.html',
  styleUrls: ['../new-request.components.css']
})
export class BadgeFailRequestComponent implements OnInit {
  // component name
  cN = {requestType: ''};

  fields: RequestMissingBadgeMetadata;

  missingBadgeTypes: AbstractModel[];
  missingBadgeTypeInput: string;
  missingBadgeTypeId: string;

  reqId: string;
  request: RequestMissingBadgeModel;

  requestForm: FormGroup;
  date: Date = new Date();
  startTime: string;

  hasSomeField: boolean;
  hasEmployeeField: boolean;
  proc: boolean;
  isDeletable: boolean;
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
    this.cN.requestType = this.translate.instant('BF_header');
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
      requestTypeId: new FormControl('POOL00000000080', Validators.required),
      badgeFailTypeId: new FormControl('', Validators.required),
      employeeId: new FormControl(this.permissions.employee.fullName, Validators.required),
      officeNameId: new FormControl(''),
      date: new FormControl(this.date.toISOString().split('T')[0], [Validators.required, this.dateVal.bind(this)]),
      startTimestamp: new FormControl('', Validators.required),
      stopTimestamp: new FormControl('', [Validators.required, this.stopTimeVal.bind(this)]),
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
      this.isDeletable = true;
      this.hasSomeField = true;
      this.hasEmployeeField = true;
      this.requestForm.disable();
      setTimeout(() => {
        this.getMBrequest();
      }, 600);
    }
  }

  getFields() {
    this.reqServe.getTableOptions('missingBadge').subscribe((fields) => {
      this.fields = fields.json().body.data.fieldMap;
      this.missingBadgeTypes = fields.json().body.data.fieldMap.badgeFailTypeId.fieldDataPool.list;
    });
  }

  setMBId(someLabel) {
    if (someLabel.length > 0) {
      this.missingBadgeTypes.forEach((value) => {
        if (value.someLabel === someLabel) {
          this.missingBadgeTypeId = value.id;
        }
      });
    }
  }

  // Get Extra Hours Request
  getMBrequest() {
    this.reqServe.getMissingBadgeRequest(this.reqId).subscribe((request) => {
      this.request = request.json().body.data;
      this.request.insertDate = this.request.insertDate.split('T')[0];

      this.requestForm.controls['id'].setValue(this.request.id);
      this.requestForm.controls['someLabel'].setValue(this.request.someLabel);
      this.requestForm.controls['insertDate'].setValue(this.request.insertDate);
      this.requestForm.controls['requestTypeId'].setValue(this.request.requestTypeId);
      this.requestForm.controls['badgeFailTypeId'].setValue(this.request.labelMap.badgeFailTypeId);
      this.requestForm.controls['employeeId'].setValue(this.request.labelMap.employeeId);
      this.requestForm.controls['officeNameId'].setValue(this.request.labelMap.officeNameId);
      this.requestForm.controls['date'].setValue(this.request.startTimestamp.split('T')[0]);
      this.requestForm.controls['startTimestamp'].setValue(this.request.startTimestamp.split('T')[1]);
      this.requestForm.controls['stopTimestamp'].setValue(this.request.stopTimestamp.split('T')[1]);

      if (this.request.authorizationId === 'POOL00000000041') {
        this.isDeletable = false;
        if (this.router.url.match(/\/hr\/request-management/) && this.request.processedId === 'POOL00000000088') {
          this.proc = true;
        }
      }
      if (this.request.employeeId === this.permissions.employee.id) {
        this.hasEmployeeField = false;
      }
    });
  }

  // EXTRA_HOURS_REQUEST_CRUD---------------------------------------------------------------------------------------------------------------

  // Insert New Request
  insertRequest() {
    this.requestForm.controls['badgeFailTypeId'].setValue(this.missingBadgeTypeId);
    this.requestForm.controls['startTimestamp'].setValue(
      this.requestForm.controls['date'].value + 'T' + this.requestForm.controls['startTimestamp'].value + ':00'
    );
    this.requestForm.controls['stopTimestamp'].setValue(
      this.requestForm.controls['date'].value + 'T' + this.requestForm.controls['stopTimestamp'].value + ':00'
    );

    this.request = this.requestForm.value;

    this.reqServe.insertMissingBadgeRequest(this.request).subscribe(
      (status) => {
        if (status.json().status.code === 'STATUS_OK') {
          this.chip.open(this.translate.instant('requests_insert_tag', this.cN), null, {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            panelClass: ['success-chip']
          });
          this.loc.back();
        } else {
          this.chip.open(this.translate.instant('requests_not_insert_tag', this.cN), null, {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            panelClass: ['error-chip']
          });
          this.reset();
        }
      },
      () => {
        this.chip.open(this.translate.instant('requests_not_insert_tag', this.cN), null, {
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
    const confText = this.translate.instant('delete_conf', this.cN);
    const confType = 'del';
    const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {text: confText, conf: confType, type: confType}
    });
    confDlg.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (result === true) {
          this.reqServe.deleteMissingBadgeRequest(this.reqId).subscribe(
            (status) => {
              if (status.json().status.code === 'STATUS_OK') {
                this.chip.open(this.translate.instant('requests_delete_tag', this.cN), null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['success-chip']
                });
                this.loc.back();
              } else {
                this.chip.open(this.translate.instant('requests_not_delete_tag', this.cN), null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['error-chip']
                });
              }
            },
            () => {
              this.chip.open(this.translate.instant('requests_not_delete_tag', this.cN), null, {
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
    this.requestForm.controls['badgeFailTypeId'].setValue('');
    this.requestForm.controls['date'].setValue('');
    this.requestForm.controls['stopTimestamp'].setValue('');
    this.requestForm.controls['startTimestamp'].setValue('');
    this.requestForm.controls['employeeNotes'].setValue('');
  }

  procReq (type: number) {
    const confType = 'hrOffice';
    if (type === 1) {
      const confText = this.translate.instant('process_conf', this.cN);
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          if (result === true) {
            this.persReqServe.patchPersonelRequests(this.reqId, 'missingBadge', 'POOL00000000090').subscribe(
              (response) => {
                if (response.json().status.code === 'STATUS_OK') {
                  this.chip.open(this.translate.instant('requests_process_tag', this.cN), null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['success-chip']
                  });
                  this.loc.back();
                } else {
                  this.chip.open(this.translate.instant('requests_not_process_tag', this.cN), null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['error-chip']
                  });
                }
              },
              () => {
                this.chip.open(this.translate.instant('requests_not_process_tag', this.cN), null, {
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
      const confText = this.translate.instant('decline_conf', this.cN);
      const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
        data: {text: confText, conf: this.confirmation, type: confType}
      });
      confDlg.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          if (result === true) {
            this.persReqServe.patchPersonelRequests(this.reqId, 'missingBadge', 'POOL00000000089').subscribe(
              (response) => {
                if (response.json().status.code === 'STATUS_OK') {
                  this.chip.open(this.translate.instant('requests_decline_tag', this.cN), null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['success-chip']
                  });
                  this.loc.back();
                } else {
                  this.chip.open(this.translate.instant('requests_not_decline_tag', this.cN), null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['error-chip']
                  });
                }
              },
              () => {
                this.chip.open(this.translate.instant('requests_not_decline_tag', this.cN), null, {
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
