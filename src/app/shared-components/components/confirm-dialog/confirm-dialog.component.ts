import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export interface DialogData {
  text: string;
  conf: boolean;
  type: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  hrEmployee: string;
  text: string;
  type: boolean;
  no: string;
  yes: string;

  constructor(
    public confDlg: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.hrEmployee = localStorage.getItem('EmpFullName');
    this.text = this.data.text;
    if (this.data.type === 'del') {
      this.type = true;
      this.no = 'NO';
      this.yes = 'Yes';
    } else {
      this.type = false;
      this.no = 'Back';
    }
  }

  onNoClick(): void {
    this.confDlg.close();
  }

}
