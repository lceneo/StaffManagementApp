import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


export interface DialogData {
  title: string;
  text: string;
  confirmButtonText: string;
  cancelButtonText: string;
}

@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss']
})
export class ModalWindowComponent {
  constructor
  (
    public dialogRef: MatDialogRef<ModalWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  public closeDialog(isLeaving: boolean){
    this.dialogRef.close(isLeaving);
  }
}
