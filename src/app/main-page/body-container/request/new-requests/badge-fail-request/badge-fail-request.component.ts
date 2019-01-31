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
import {RequestMissingBadgeMetadata} from '../../../../../shared-components/models/requests-models/request-missing-badge-metadata';
import {RequestMissingBadgeModel} from '../../../../../shared-components/models/requests-models/request-missing-badge.model';

@Component({
  selector: 'app-badge-fail-request',
  templateUrl: './badge-fail-request.component.html',
  styleUrls: ['../new-request.components.css']
})
export class BadgeFailRequestComponent implements OnInit {
  fields: RequestMissingBadgeMetadata;

  missingBadgeTypes: AbstractModel[];
  missingBadgeTypeInput: string;
  missingBadgeTypeId: string;

  reqId: string;
  request: RequestMissingBadgeModel;

  employee: EmployeeModel;
  offices: AbstractModel[];
  requestForm: FormGroup;
  date: Date = new Date();
  OfficeId: string;
  ManagerId: string;

  hasSomeField: boolean;
  hasEmployeeField: boolean;
  isDeletable: boolean;
  isManager: boolean;
  displayApprove: boolean;
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
    const insertDate = new Date(this.date.valueOf() + 3600000);
    this.requestForm = new FormGroup({
      id: new FormControl(''),
      someLabel: new FormControl(''),
      insertDate: new FormControl(insertDate.toISOString().split('.')[0], Validators.required),
      requestTypeId: new FormControl('POOL00000000080', Validators.required),
      badgeFailTypeId: new FormControl('', Validators.required),
      employeeId: new FormControl(localStorage.getItem('EmpId'), Validators.required),
      officeNameId: new FormControl('', Validators.required),
      managerId: new FormControl('', Validators.required),
      date: new FormControl(this.date.toISOString().split('T')[0], Validators.required),
      startTimestamp: new FormControl('', Validators.required),
      stopTimestamp: new FormControl('', Validators.required),
      employeeNotes: new FormControl('Notes...'),
      approvementId: new FormControl(''),
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
      this.getEmployeeInfo(localStorage.getItem('EmpId'));
      this.requestForm.controls['officeNameId'].disable();
      this.requestForm.controls['managerId'].disable();
    } else {
      this.hasSomeField = true;
      this.hasEmployeeField = true;
      this.requestForm.disable();
      this.getMBrequest();
    }
  }

  getFields() {
    this.reqServe.getTableOptions('missingBadge').subscribe((fields) => {
      this.fields = fields.json().body.data.fieldMap;
      this.missingBadgeTypes = fields.json().body.data.fieldMap.badgeFailTypeId.fieldDataPool.list;
    });
  }

  setMTId(someLabel) {
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
      this.requestForm.controls['badgeFailTypeId'].setValue(this.request.badgeFailTypeId);
      this.requestForm.controls['employeeId'].setValue(this.request.labelMap.employeeId);
      this.requestForm.controls['date'].setValue(this.request.startTimestamp.split('T')[0]);
      this.requestForm.controls['startTimestamp'].setValue(this.request.startTimestamp.split('T')[1]);
      this.requestForm.controls['stopTimestamp'].setValue(this.request.stopTimestamp.split('T')[1]);
      if (this.request.approvementId !== undefined) {
        this.displayApprove = true;
        this.requestForm.controls['approvementId'].setValue(this.request.labelMap.approvementId);
        if (this.request.approvementId === 'POOL00000000043' && this.request.employeeId === localStorage.getItem('EmpId')) {
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
      this.ManagerId = this.employee.managerId;
      if (this.employee.managerId === localStorage.getItem('EmpId') && this.request.approvementId === 'POOL00000000043') {
        this.isManager = true;
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
    this.requestForm.controls['badgeFailTypeId'].setValue(this.missingBadgeTypeId);
    this.requestForm.controls['startTimestamp'].setValue(
      this.requestForm.controls['date'].value + 'T' + this.requestForm.controls['startTimestamp'].value + ':00'
    );
    this.requestForm.controls['stopTimestamp'].setValue(
      this.requestForm.controls['date'].value + 'T' + this.requestForm.controls['stopTimestamp'].value + ':00'
    );

    this.request = this.requestForm.value;
    this.request.managerId = this.ManagerId;
    this.request.officeNameId = this.OfficeId;

    this.reqServe.insertMissingBadgeRequest(this.request).subscribe(
      (status) => {
        if (status.json().status.code === 'STATUS_OK') {
          this.chip.open('Badge failure request is sent successfully!', null, {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            panelClass: ['success-chip']
          });
          this.loc.back();
        }
      },
      () => {
        this.chip.open('Badge failure request isn\'t sent, sorry!', null, {
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
        this.reqServe.deleteMissingBadgeRequest(this.reqId).subscribe(
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
    this.requestForm.controls['badgeFailTypeId'].setValue('');
    this.requestForm.controls['date'].setValue('');
    this.requestForm.controls['stopTimestamp'].setValue('');
    this.requestForm.controls['startTimestamp'].setValue('');
    this.requestForm.controls['employeeNotes'].setValue('');
  }

  // approve or deny request
  // approveOrDeny(type: number) {
  //   const confType = 'manager';
  //   if (type === 1) {
  //     const confText = 'Are you shure that you want to approve this request ?';
  //     const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
  //       data: {text: confText, conf: this.confirmation, type: confType}
  //     });
  //     confDlg.afterClosed().subscribe((result) => {
  //       if (result.split('|')[0] === 'true') {
  //         this.reqServe.managerNdirectorDecisionExtraHoursRequest('approve', this.reqId, result.split('|')[1]).subscribe(
  //           (response) => {
  //             if (response.json().status.code === 'STATUS_OK') {
  //               this.chip.open('Extra hour request is APPROVED!', null, {
  //                 duration: 5000,
  //                 verticalPosition: 'bottom',
  //                 horizontalPosition: 'left',
  //                 panelClass: ['success-chip']
  //               });
  //               this.loc.back();
  //             }
  //           },
  //           () => {
  //             this.chip.open('Error, extra hours request isn\'t approved!', null, {
  //               duration: 5000,
  //               verticalPosition: 'bottom',
  //               horizontalPosition: 'left',
  //               panelClass: ['error-chip']
  //             });
  //           }
  //         );
  //       }
  //     });
  //   } else {
  //     const confText = 'Are you shure that you want to deny this request ?';
  //     const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
  //       data: {text: confText, conf: this.confirmation, type: confType}
  //     });
  //     confDlg.afterClosed().subscribe(
  //       (result) => {
  //         if (result.split('|')[0] === 'true') {
  //           this.reqServe.managerNdirectorDecisionExtraHoursRequest('deny', this.reqId, result.split('|')[1]).subscribe(
  //             (response) => {
  //               if (response.json().status.code === 'STATUS_OK') {
  //                 this.chip.open('Extra hour request is DENIED!', null, {
  //                   duration: 5000,
  //                   verticalPosition: 'bottom',
  //                   horizontalPosition: 'left',
  //                   panelClass: ['success-chip']
  //                 });
  //                 this.loc.back();
  //               }
  //             },
  //             () => {
  //               this.chip.open('Error, extra hours request isn\'t denied!', null, {
  //                 duration: 5000,
  //                 verticalPosition: 'bottom',
  //                 horizontalPosition: 'left',
  //                 panelClass: ['error-chip']
  //               });
  //             }
  //           );
  //         }
  //       }
  //     );
  //   }
  // }
}
