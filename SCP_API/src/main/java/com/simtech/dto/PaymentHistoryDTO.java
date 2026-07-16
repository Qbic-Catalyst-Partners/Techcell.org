package com.simtech.dto;

import java.util.Date;

public class PaymentHistoryDTO {
    private Long id;
    private Date transactionDate;
    private double amount;
    private String invoiceNumber;
    private String academicInvoiceNumber;
    private String transactionReferenceNumber;
    private String paymentMethod;
    private String status;
    private String razorpayPaymentId;
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Date getTransactionDate() {
        return transactionDate;
    }
    
    public void setTransactionDate(Date transactionDate) {
        this.transactionDate = transactionDate;
    }
    
    public double getAmount() {
        return amount;
    }
    
    public void setAmount(double amount) {
        this.amount = amount;
    }
    
    public String getInvoiceNumber() {
        return invoiceNumber;
    }
    
    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }
    
    public String getAcademicInvoiceNumber() {
        return academicInvoiceNumber;
    }
    
    public void setAcademicInvoiceNumber(String academicInvoiceNumber) {
        this.academicInvoiceNumber = academicInvoiceNumber;
    }
    
    public String getTransactionReferenceNumber() {
        return transactionReferenceNumber;
    }
    
    public void setTransactionReferenceNumber(String transactionReferenceNumber) {
        this.transactionReferenceNumber = transactionReferenceNumber;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }
}