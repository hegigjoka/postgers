import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

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

  hrEmployee: string;

  text: string;

  extraFieldType: boolean;
  extraDropdownType: boolean;
  type: boolean;
  no: string;
  yes: string;

  notes = 'Notes...';
  authType = ' ';

  constructor(
    public confDlg: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.hrEmployee = localStorage.getItem('EmpFullName');
    this.text = this.data.text;
    if (this.data.type === 'del' || this.data.type === 'manager' || this.data.type === 'director') {
      this.type = true;
      this.no = 'NO';
      this.yes = 'Yes';
      if (this.data.type === 'manager' || this.data.type === 'director') {
        this.extraFieldType = true;
        if (this.data.type === 'director') {
          this.extraDropdownType = true;
        }
      }
    } else {
      this.type = false;
      this.no = 'Back';
    }
  }

  onYesClicl(type: boolean, field: boolean, dropdown: boolean) {
    if (type === true && field === true && dropdown === true) {
      return !this.data.conf + '|' + this.notes + '|' + this.authType;
    } else if (type === true && field === true) {
      return !this.data.conf + '|' + this.notes;
    } else if (type === true) {
      return !this.data.conf;
    }
  }

  onNoClick(): void {
    this.confDlg.close();
  }

}
