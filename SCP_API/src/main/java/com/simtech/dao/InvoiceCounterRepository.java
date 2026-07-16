package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.InvoiceCounter;

@Repository
public interface InvoiceCounterRepository extends JpaRepository<InvoiceCounter, Long> {
    InvoiceCounter findByYear(String year);
    InvoiceCounter findByAcademicYear(String academicYear);
}