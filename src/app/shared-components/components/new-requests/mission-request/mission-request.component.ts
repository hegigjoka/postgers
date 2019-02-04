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
import {RequestMissionMetadata} from '../../../models/requests-models/request-mission-metadata';
import {RequestMissionModel} from '../../../models/requests-models/request-mission.model';

@Component({
  selector: 'app-mission-request',
  templateUrl: './mission-request.component.html',
  styleUrls: ['../new-request.components.css']
})
export class MissionRequestComponent implements OnInit {
  fields: RequestMissionMetadata;

  missionTypes: AbstractModel[];
  missionTypeInput: string;
  missionTypeId: string;

  reqId: string;
  request: RequestMissionModel;

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
    this.getEmployeeInfo(localStorage.getItem('EmpId'));

    const insertDate = new Date(this.date.valueOf() + 3600000);
    this.requestForm = new FormGroup({
      id: new FormControl(''),
      someLabel: new FormControl(''),
      insertDate: new FormControl(insertDate.toISOString().split('.')[0], Validators.required),
      requestTypeId: new FormControl('POOL00000000078', Validators.required),
      missionTypeId: new FormControl('Conference', Validators.required),
      missionWhere: new FormControl(''),
      employeeId: new FormControl(localStorage.getItem('EmpId'), Validators.required),
      officeNameId: new FormControl('', Validators.required),
      managerId: new FormControl('', Validators.required),
      startTimestamp: new FormControl(''),
      startDate: new FormControl(insertDate.toISOString().split('T')[0], Validators.required),
      startTime: new FormControl(insertDate.toISOString().split('T')[1].substr(0, 5), Validators.required),
      stopTimestamp: new FormControl(''),
      stopDate: new FormControl('', Validators.required),
      stopTime: new FormControl('', Validators.required),
      approvementId: new FormControl(''),
      labelMap: new FormGroup({
        requestTypeId: new FormControl('Mission'),
        employeeId: new FormControl(localStorage.getItem('EmpFullName')),
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
    } else {
      this.hasSomeField = true;
      this.hasEmployeeField = true;
      this.requestForm.disable();
      this.getMrequest();
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
      this.requestForm.controls['startTimestamp'].setValue(this.request.startTimestamp);
      this.requestForm.controls['startDate'].setValue(this.request.startTimestamp.split('T')[0]);
      this.requestForm.controls['startTime'].setValue(this.request.startTimestamp.split('T')[1].substr(0, 5));
      this.requestForm.controls['stopTimestamp'].setValue(this.request.stopTimestamp);
      this.requestForm.controls['stopDate'].setValue(this.request.stopTimestamp.split('T')[0]);
      this.requestForm.controls['stopTime'].setValue(this.request.stopTimestamp.split('T')[1].substr(0, 5));
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
      this.ManagerId = this.employee.managerId;
      if (this.employee.managerId === localStorage.getItem('EmpId') && this.request.approvementId === 'POOL00000000043') {
        this.isManager = true;
        if (this.request.authorizationId === 'POOL00000000041') {
          this.isDeletable = false;
          this.isManager = false;
        }
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
    this.request.officeNameId = this.OfficeId;
    this.request.managerId = this.ManagerId;

    this.reqServe.insertMissionRequest(this.request).subscribe(
      (status) => {
        if (status.json().status.code === 'STATUS_OK') {
          this.chip.open('Mission request is sent successfully!', null, {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            panelClass: ['success-chip']
          });
          this.loc.back();
        }
      },
      () => {
        this.chip.open('Mission request isn\'t sent, sorry!', null, {
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
    const confText = 'Are you sure that you want to delete this pending mission request ?';
    const confType = 'del';
    const confDlg = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {text: confText, conf: confType, type: confType}
    });
    confDlg.afterClosed().subscribe((resuelt) => {
      this.confirmation = resuelt;
      if (this.confirmation === true) {
        this.reqServe.deleteMissionRequest(this.reqId).subscribe(
          (status) => {
            if (status.json().status.code === 'STATUS_OK') {
              this.chip.open('Mission request is deleted successfully!', null, {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'left',
                panelClass: ['success-chip']
              });
              this.loc.back();
            }
          },
          () => {
            this.chip.open('Mission request can\'t be deleted, sorry!', null, {
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
    this.requestForm.controls['missionTypeId'].setValue('');
    this.requestForm.controls['missionWhere'].setValue('');
    this.requestForm.controls['stopTimestamp'].setValue('');
    this.requestForm.controls['startTimestamp'].setValue('');
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
          this.reqServe.managerNdirectorDecisionMissionRequest('approve', this.reqId, result.split('|')[1]).subscribe(
            (response) => {
              if (response.json().status.code === 'STATUS_OK') {
                this.chip.open('Mission request is APPROVED!', null, {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  panelClass: ['success-chip']
                });
                this.loc.back();
              }
            },
            () => {
              this.chip.open('Error, mission request isn\'t approved!', null, {
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
            this.reqServe.managerNdirectorDecisionMissionRequest('deny', this.reqId, result.split('|')[1]).subscribe(
              (response) => {
                if (response.json().status.code === 'STATUS_OK') {
                  this.chip.open('Mission request is DENIED!', null, {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'left',
                    panelClass: ['success-chip']
                  });
                  this.loc.back();
                }
              },
              () => {
                this.chip.open('Error, mission request isn\'t denied!', null, {
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
}
