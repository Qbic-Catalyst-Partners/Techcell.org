import { Component, OnInit } from '@angular/core';
import { purchaseMeta } from './purchaseMeta';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrl: './purchase-history.component.scss'
})
export class PurchaseHistoryComponent implements OnInit{
  purchaseHeader:any = [];
  purchaseData:any = [];
  ngOnInit(): void {
    this.purchaseHeader = purchaseMeta;
  }

}
