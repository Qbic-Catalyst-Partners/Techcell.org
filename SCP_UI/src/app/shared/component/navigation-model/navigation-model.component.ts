import { Component, Inject, Input } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navigation-model',
  templateUrl: './navigation-model.component.html',
  styleUrl: './navigation-model.component.scss',
})
export class NavigationModelComponent {
  @Input() message1: string = '';
  @Input() message2: string = '';
  @Input() btnName: string = 'Ok';
  @Input() path: string = '/';
  constructor(
    private router: Router,
    private matDialogRef: MatDialogRef<NavigationModelComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private matDialog: MatDialog
  ) {}

  close() {
    this.matDialogRef.close();
  }

  navigate() {
    this.matDialogRef.close();
    this.router.navigate([`${this.path}`]);
  }
}
