package com.simtech.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.simtech.entity.Software;

@Repository
public interface SoftwareRepository extends JpaRepository<Software, Long>, JpaSpecificationExecutor<Software> {
    
    // Method to find software by status and order by creation date descending
    Page<Software> findByStatusOrderByCreatedDateDesc(String status, Pageable pageable);
}