import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrl: './share.component.scss',
})
export class ShareComponent {
  public toolTipMsg: string = 'Copy to clipboard';
  @Input() msg: string = '';
  public isCopied: boolean = false;
  constructor(private activeModal: NgbActiveModal, public router: Router) {}

  close() {
    this.activeModal.close();
  }

  notify(t: any, isCopied: boolean) {
    let selBox = document.createElement('input');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.msg;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.isCopied = isCopied;
    // console.log('called');
  }
}
