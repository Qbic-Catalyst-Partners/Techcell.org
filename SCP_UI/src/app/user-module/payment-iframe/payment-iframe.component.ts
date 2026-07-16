import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-iframe',
  templateUrl: './payment-iframe.component.html',
  styleUrl: './payment-iframe.component.scss'
})
export class PaymentIframeComponent implements OnInit{
  @Input() url: string = 'https://example.com/';
  urlMap: SafeResourceUrl | undefined;
  tabIndex: number = 0;
  constructor(public sanitizer: DomSanitizer,
    private activeModal: NgbActiveModal
  ){}
  close(){
    this.activeModal.close();
    // this.router.navigate(['/']);
  }
  ngOnInit(): void {
    this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
}
