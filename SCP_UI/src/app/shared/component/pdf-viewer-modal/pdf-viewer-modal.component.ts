import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pdf-viewer-modal',
  templateUrl: './pdf-viewer-modal.component.html',
  styleUrls: ['./pdf-viewer-modal.component.scss']
})
export class PdfViewerModalComponent implements OnInit {
  @Input() userId!: number;
  pdfUrl?: SafeResourceUrl;

  constructor(private httpService: HttpService, private sanitizer: DomSanitizer, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    if (!this.userId) {
      console.error('PdfViewerModalComponent requires userId');
      return;
    }

    this.httpService.get(`/api/resume/${this.userId}/pdf`, { responseType: 'blob' }).subscribe(blob => {
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }

  download(): void {
    this.httpService.get(`/api/resume/${this.userId}/pdf`, { responseType: 'arraybuffer' }).subscribe(buffer => {
      const pdfBlob = new Blob([buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  close(): void {
    this.activeModal.close();
  }
} 