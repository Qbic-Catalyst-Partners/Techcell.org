package com.simtech.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class InvoiceCounter {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String year;
    private Long lastInvoiceNumber;
    private Long lastTransactionNumber;
    private String academicYear;  // e.g., "24-25"
    private Long lastAcademicInvoiceNumber;
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getYear() {
        return year;
    }
    
    public void setYear(String year) {
        this.year = year;
    }
    
    public Long getLastInvoiceNumber() {
        return lastInvoiceNumber;
    }
    
    public void setLastInvoiceNumber(Long lastInvoiceNumber) {
        this.lastInvoiceNumber = lastInvoiceNumber;
    }
    
    public Long getLastTransactionNumber() {
        return lastTransactionNumber;
    }
    
    public void setLastTransactionNumber(Long lastTransactionNumber) {
        this.lastTransactionNumber = lastTransactionNumber;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public Long getLastAcademicInvoiceNumber() {
        return lastAcademicInvoiceNumber;
    }

    public void setLastAcademicInvoiceNumber(Long lastAcademicInvoiceNumber) {
        this.lastAcademicInvoiceNumber = lastAcademicInvoiceNumber;
    }
}