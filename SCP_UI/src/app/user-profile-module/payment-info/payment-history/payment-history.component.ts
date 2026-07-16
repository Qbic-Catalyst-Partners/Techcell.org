import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { ApiService } from '../../../shared/services/api.service';
import { CommonService } from '../../../shared/services/common.service';
import { saveAs } from 'file-saver';

interface PaymentRecord {
  date: string;
  invoiceNumber: string;
  amount: number;
  payeeName: string;
  transactionNumber: string;
  paymentMethod: string;
  id: number;
  academicInvoiceNumber: string;
  razorpayPaymentId: string;
}

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.scss',
})
export class PaymentHistoryComponent implements OnInit {
  paymentRecords: PaymentRecord[] = [];
  filteredRecords: PaymentRecord[] = [];
  selectedInvoice: PaymentRecord | null = null;
  isLoading = false;

  // Using string format for Angular datepicker compatibility
  fromDate: any;
  toDate: any;

  // Placeholders for date pickers that show the default dates
  fromDatePlaceholder: string = '';
  toDatePlaceholder: string = '';

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private apiService: ApiService,
    private commonService: CommonService
  ) {
    this.dateAdapter.setLocale('en-GB'); // DD-MM-YYYY format
  }

  ngOnInit(): void {
    console.log('Component initialized');
    // Set default dates - from date as 3 months ago, to date as today
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Set to first day of month for from date
    threeMonthsAgo.setDate(1);

    // Set to last day of month for to date
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    console.log('Default from date:', threeMonthsAgo);
    console.log('Default to date:', lastDayOfMonth);

    // Generate placeholder text for the date pickers
    this.fromDatePlaceholder = threeMonthsAgo.toLocaleString('en-US', {
      month: 'short',
      year: 'numeric',
    });
    this.toDatePlaceholder = lastDayOfMonth.toLocaleString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    // For ng2-date-picker, use the native Date objects
    // The component will convert them internally
    this.fromDate = threeMonthsAgo;
    this.toDate = lastDayOfMonth;

    this.fetchPaymentHistory();
  }

  fetchPaymentHistory(): void {
    console.log('Fetching payment history...');
    this.isLoading = true;
    this.apiService.getPaymentHistory().subscribe({
      next: (response) => {
        console.log('Raw API response:', response);
        if (response && response.data) {
          this.paymentRecords = response.data.map((payment: any) => {
            const formattedDate = this.formatDate(
              new Date(payment.transactionDate)
            );
            console.log('Original date:', payment.transactionDate);
            console.log(
              'Converted date object:',
              new Date(payment.transactionDate)
            );
            console.log('Formatted date string:', formattedDate);

            return {
              id: payment.id,
              date: formattedDate,
              invoiceNumber: payment.invoiceNumber || 'N/A',
              academicInvoiceNumber: payment.academicInvoiceNumber || 'N/A',
              amount: payment.amount,
              payeeName: 'TechCell',
              transactionNumber: payment.transactionReferenceNumber || 'N/A',
              paymentMethod: payment.paymentMethod || 'Online Payment',
              razorpayPaymentId: payment.razorpayPaymentId || 'N/A',
            };
          });
          console.log('Converted payment records:', this.paymentRecords);
          this.filterRecords();
        } else {
          console.log('No data in response or response format unexpected');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching payment history:', error);
        this.isLoading = false;
      },
    });
  }

  // Format date to DD-MM-YYYY
  formatDate(date: Date): string {
    console.log('Formatting date:', date);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  /**
   * Converts a date string in DD-MM-YYYY format to a Date object
   */
  parseDate(dateStr: string): Date {
    console.log('Parsing date string:', dateStr);
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  /**
   * Filters the payment records based on the from and to dates
   */
  filterRecords(): void {
    console.log(
      'Filtering records with fromDate:',
      this.fromDate,
      'toDate:',
      this.toDate
    );

    if (!this.fromDate || !this.toDate) {
      console.log(
        'Missing fromDate or toDate, setting filtered records to empty array'
      );
      this.filteredRecords = [];
      return;
    }

    // Handle different types of date inputs (native Date or datepicker object)
    let fromDate: Date;
    let toDate: Date;
    let filterToDate: Date; // Special date for filtering - last day of month

    try {
      if (this.fromDate instanceof Date) {
        fromDate = this.fromDate;
      } else {
        fromDate = new Date(this.fromDate);
      }

      if (this.toDate instanceof Date) {
        toDate = this.toDate;
      } else {
        toDate = new Date(this.toDate);
      }

      // Create a date representing the last day of the month selected in toDate
      // First day of next month, minus one day
      filterToDate = new Date(toDate.getFullYear(), toDate.getMonth() + 1, 0);
      // Set to end of day (23:59:59.999)
      filterToDate.setHours(23, 59, 59, 999);

      console.log('Converted fromDate:', fromDate);
      console.log('Converted toDate:', toDate);
      console.log('Filter toDate (end of month):', filterToDate);

      // Filter records that fall within the date range, using filterToDate instead of toDate
      this.filteredRecords = this.paymentRecords.filter((record) => {
        const recordDate = this.parseDate(record.date);
        console.log(
          'Record date:',
          recordDate,
          'for record:',
          record.invoiceNumber
        );
        // Use filterToDate (last day of month) instead of toDate
        const isInRange = recordDate >= fromDate && recordDate <= filterToDate;
        console.log('Is in range:', isInRange);
        return isInRange;
      });

      console.log('Filtered records count:', this.filteredRecords.length);
      console.log('Filtered records:', this.filteredRecords);

      // Select the first record by default if available
      if (this.filteredRecords.length > 0) {
        this.selectInvoice(this.filteredRecords[0]);
      } else {
        this.selectedInvoice = null;
      }
    } catch (error) {
      console.error('Error in filterRecords:', error);
      this.filteredRecords = this.paymentRecords; // Show all records on error
    }
  }

  /**
   * Handles date changes for from date
   */
  onFromDateChange(event: any): void {
    console.log('From date change event:', event);

    // Keep original event value first
    this.fromDate = event;

    // Then apply first day of month logic in filterRecords
    this.filterRecords();
  }

  /**
   * Handles date changes for to date
   */
  onToDateChange(event: any): void {
    console.log('To date change event:', event);

    // Keep original event value first
    this.toDate = event;

    // Do NOT modify this.toDate here - just use the event as-is

    // If you need to use the last day of the month for filtering,
    // handle that in filterRecords() method
    this.filterRecords();
  }

  /**
   * Selects an invoice for display in the details section
   */
  selectInvoice(record: PaymentRecord): void {
    console.log('Selected invoice:', record);
    this.selectedInvoice = record;
  }

  /**
   * Gets the month and year string for the invoice display
   */
  getMonthYear(dateStr: string): string {
    const date = this.parseDate(dateStr);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  /**
   * Download the invoice PDF
   */
  downloadInvoice(): void {
    if (!this.selectedInvoice) return;

    this.isLoading = true;
    this.apiService.downloadInvoice(this.selectedInvoice.id).subscribe({
      next: (data) => {
        this.isLoading = false;
        const blob = new Blob([data], { type: 'application/pdf' });
        saveAs(
          blob,
          `TechCell_Invoice_${this.selectedInvoice?.invoiceNumber}.pdf`
        );

        // Show success modal
        this.commonService.dialog(
          'newSuccessModal',
          'Your invoice has been successfully delivered to your email',
          '',
          'OK',
          'Success'
        );
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error downloading invoice:', error);

        // Show error modal
        this.commonService.dialog(
          'newErrorModal',
          'Invoice email delivery failed! Please try again later',
          '',
          'OK',
          'Error'
        );
      },
    });
  }

  /**
   * Email the invoice to the user
   */
  emailInvoice(): void {
    if (!this.selectedInvoice) return;
    console.log('Emailing invoice for ID:', this.selectedInvoice.id);

    this.isLoading = true;
    this.apiService.emailInvoice(this.selectedInvoice.id).subscribe({
      next: (response) => {
        console.log('Email sent successfully:', response);
        this.isLoading = false;

        // Show success modal
        this.commonService.dialog(
          'newSuccessModal',
          'Invoice has been successfully emailed to the user',
          '',
          'OK',
          'Email Sent'
        );
      },
      error: (error: any) => {
        console.error('Error emailing invoice:', error);
        this.isLoading = false;

        // Show error modal
        this.commonService.dialog(
          'newErrorModal',
          'Failed to email invoice! Please try again later',
          '',
          'OK',
          'Failed'
        );
      },
    });
  }
}
