package com.simtech.dao;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.Career;

@Repository
public interface CareerRepository extends JpaRepository<Career, Long> {
	Career findByInternshipId(Long Id);

	Career findByJobId(Long Id);

	Career findByProjectId(Long Id);

	Career findByCertificationId(Long Id);

	List<Career> findAllByStatusOrderByCreatedDateDesc(String status, Pageable pageable);

	Long countByStatus(String status);

}