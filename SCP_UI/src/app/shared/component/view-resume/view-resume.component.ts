import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../../../common/common.service';
import { CareerService } from '../../../careers-module/career.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view-resume',
  templateUrl: './view-resume.component.html',
  styleUrl: './view-resume.component.scss'
})
export class ViewResumeComponent implements OnInit {
  @Input() data: any;
  resumeData: any = {};
  resumePhoto: any;
  constructor(private careerService: CareerService,
    public commonService: CommonService
  ) { }
  ngOnInit(): void {
    // If resumeData already exists (injected directly), skip API fetch
    if (this.resumeData && Object.keys(this.resumeData).length) {
      return;
    }
    if (this.data && this.data.userId) {
      this.getResumeData();
    }
  }

  getResumeData() {
    this.careerService.getResume(this.data.userId).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.data?.resumeData) {
          this.resumeData = JSON.parse(res?.data?.resumeData)
        }
        this.resumePhoto = res?.data?.resumePhoto;
      }
    });
  }

  /**
   * Generates an A4-sized PDF of the resume without the grey shadow/border artefacts.
   * If the resume height exceeds one page, it automatically flows on to subsequent pages.
   */
  public generatePDF(): void {
    const element = document.getElementById('contentToConvert');
    if (!element) {
      return;
    }

    /* Temporarily remove drop shadow / border-radius that show up as grey lines in the PDF */
    element.classList.add('no-shadow');

    // Slight delay ensures styles are applied before capture
    setTimeout(() => {
      html2canvas(element, {
        scale: 2,               // better quality
        backgroundColor: '#ffffff', // ensure white background
        scrollY: -window.scrollY,
      }).then((canvas) => {
        // Restore original styles
        element.classList.remove('no-shadow');

        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgData = canvas.toDataURL('image/png');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const marginBottom = 10;                // Bottom margin in mm
        const pageContentHeight = pdfHeight - marginBottom; // Usable height per page

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        const sidebarWidth = pdfWidth * 0.3; // ~30% same as layout

        // Helper to paint sidebar for current page
        const paintSidebar = () => {
          pdf.setFillColor(29, 55, 82); // #1d3752
          pdf.rect(0, 0, sidebarWidth, pdfHeight, 'F'); // full-height sidebar
        };

        // Helper to paint bottom margin (white rectangle) on current page
        const paintBottomMargin = () => {
          pdf.setFillColor(255, 255, 255); // white
          pdf.rect(sidebarWidth, pdfHeight - marginBottom, pdfWidth - sidebarWidth, marginBottom, 'F'); // leave sidebar colored
        };

        // Add the first page
        paintSidebar();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        paintBottomMargin();
        heightLeft -= pageContentHeight;
        position = -pageContentHeight;

        // Loop through remaining bytes of image height
        while (heightLeft > 0) {
          pdf.addPage();
          paintSidebar();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          paintBottomMargin();
          heightLeft -= pageContentHeight;
          position -= pageContentHeight;
        }

        pdf.save('Resume.pdf');
      });
    }, 50);
  }

}
