import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {RequestsService} from '../../providers/requests.service';
import {AbstractModel} from '../../models/shared-models/abstract.model';
import {HrPermission} from '../../permissions/hr-permission';

export interface DialogData {
  type: string;
  text: string;
  conf: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  extraFieldType: boolean;
  extraDropdownType: boolean;
  type: boolean;
  no: string;
  yes: string;

  hrEmployee: string;
  text: string;
  notes: string;

  authTypeId = '';
  authTypeInput: string;
  authType: AbstractModel[];

  constructor(
    public permissions: HrPermission,
    private reqServe: RequestsService,
    public confDlg: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.hrEmployee = this.permissions.employee.fullName;
    this.text = this.data.text;
    if (this.data.type === 'del' || this.data.type === 'manager' || this.data.type.match(/director/) || this.data.type === 'hrOffice') {
      this.type = true;
      if (localStorage.getItem('EmpLang') === 'en') {
        this.no = 'No';
        this.yes = 'Yes';
      } else if (localStorage.getItem('EmpLang') === 'it') {
        this.no = 'No';
        this.yes = 'Si';
      } else {
        this.no = 'Jo';
        this.yes = 'Po';
      }
      if (this.data.type === 'manager' || this.data.type.match(/director/)) {
        this.extraFieldType = true;
        if (this.data.type === 'xHdirector') {
          this.reqServe.getTableOptions('extraHours').subscribe((authType) => {
            this.authType = authType.json().body.data.fieldMap.authorizationTypeId.fieldDataPool.list;
            this.extraDropdownType = true;
          });
        }
      }
    } else {
      this.type = false;
      if (localStorage.getItem('EmpLang') === 'en') {
        this.no = 'Back';
      } else if (localStorage.getItem('EmpLang') === 'it') {
        this.no = 'Indietro';
      } else {
        this.no = 'Prapa';
      }
    }
  }

  setAuthTypeId(someLabel) {
    if (someLabel.length > 0) {
      this.authType.forEach((value) => {
        if (value.someLabel === someLabel) {
          this.authTypeId = value.id;
        }
      });
    }
  }

  onYesClicl(type: boolean, field: boolean, dropdown: boolean) {
    if (type === true && field === true && dropdown === true) {
      if (this.authTypeId.match(/POOL000000000[0-9]{2}/)) {
        return true + '|' + this.notes + '|' + this.authTypeId;
      } else {
        return true + '|' + this.notes + '|POOL00000000047';
      }
    } else if (type === true && field === true) {
      return true + '|' + this.notes;
    } else if (type === true) {
      return true;
    }
  }

  onNoClick(): void {
    this.confDlg.close();
  }

}
