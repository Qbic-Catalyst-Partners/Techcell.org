package com.simtech.service;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.simtech.constants.ApplicationConstants;
import com.simtech.dao.InvoiceCounterRepository;
import com.simtech.entity.InvoiceCounter;

@Service
public class InvoiceService {
    
    @Autowired
    private InvoiceCounterRepository invoiceCounterRepository;
    
    @Transactional
    public String generateInvoiceNumber() {
        String currentYear = String.valueOf(LocalDate.now().getYear());
        InvoiceCounter counter = invoiceCounterRepository.findByYear(currentYear);
        
        if (counter == null) {
            counter = new InvoiceCounter();
            counter.setYear(currentYear);
            counter.setLastInvoiceNumber(0L);
            counter.setLastTransactionNumber(0L);
            counter = invoiceCounterRepository.save(counter);
        }
        
        // Increment the last invoice number
        counter.setLastInvoiceNumber(counter.getLastInvoiceNumber() + 1);
        invoiceCounterRepository.save(counter);
        
        // Format: INV-YYYY-NNNNNN (e.g., INV-2025-000001)
        return String.format("INV-%s-%06d", currentYear, counter.getLastInvoiceNumber());
    }

    @Transactional
    public String generateAcademicInvoiceNumber() {
        LocalDate now = LocalDate.now();
        String academicYear = getAcademicYear(now);
        
        InvoiceCounter counter = invoiceCounterRepository.findByAcademicYear(academicYear);
        
        if (counter == null) {
            counter = new InvoiceCounter();
            counter.setAcademicYear(academicYear);
            counter.setLastAcademicInvoiceNumber(0L);
            counter = invoiceCounterRepository.save(counter);
        }
        
        // Increment the last academic invoice number
        counter.setLastAcademicInvoiceNumber(counter.getLastAcademicInvoiceNumber() + 1);
        invoiceCounterRepository.save(counter);
        
        // Format: TC/YY-YY/NNNNNNN (e.g., TC/24-25/0000001)
        return String.format("TC/%s/%07d", academicYear, counter.getLastAcademicInvoiceNumber());
    }
    
    private String getAcademicYear(LocalDate date) {
        int year = date.getYear();
        Month currentMonth = date.getMonth();
        Month startMonth = Month.valueOf(ApplicationConstants.ACADEMIC_START_MONTH.toUpperCase());
        
        // If current month is before the start month, academic year started in previous year
        if (currentMonth.getValue() < startMonth.getValue()) {
            year--;
        }
        
        // Format: "YY-YY" (e.g., "24-25")
        String firstYear = String.valueOf(year).substring(2);
        String secondYear = String.valueOf(year + 1).substring(2);
        return firstYear + "-" + secondYear;
    }
    
    @Transactional
    public String generateTransactionReferenceNumber() {
        String currentYear = String.valueOf(LocalDate.now().getYear());
        InvoiceCounter counter = invoiceCounterRepository.findByYear(currentYear);
        
        if (counter == null) {
            counter = new InvoiceCounter();
            counter.setYear(currentYear);
            counter.setLastInvoiceNumber(0L);
            counter.setLastTransactionNumber(0L);
            counter = invoiceCounterRepository.save(counter);
        }
        
        // Increment the last transaction number
        counter.setLastTransactionNumber(counter.getLastTransactionNumber() + 1);
        invoiceCounterRepository.save(counter);
        
        // Format: TRX-YYYY-NNNNNN (e.g., TRX-2025-000001)
        return String.format("TRX-%s-%06d", currentYear, counter.getLastTransactionNumber());
    }
}