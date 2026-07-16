import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-software-download',
  templateUrl: './software-download.component.html',
  styleUrl: './software-download.component.scss'
})
export class SoftwareDownloadComponent{
  @Input() rowItem:any;
constructor(private activeModal: NgbActiveModal,
    public router: Router,
    ){}
  
    close(){
      this.activeModal.close();
    }
  
    join(){
    window.open(this.rowItem.softwarelink,"_blank")?.focus();
    this.close()
    }
}
