package com.simtech.dao;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.CareerUser;
import com.simtech.entity.Certification;
import com.simtech.entity.Internship;
import com.simtech.entity.Job;
import com.simtech.entity.Project;

@Repository
public interface CareerUserRepository extends JpaRepository<CareerUser, Long> {
	List<CareerUser> findByUserDetailUserId(Long userId);

	List<CareerUser> findByUserDetailUserId(Long userId, Pageable pageable);

	List<CareerUser> findByUserDetailUserIdOrderByCareerCreatedDateDesc(Long userId, Pageable pageable);

	List<CareerUser> findByCareerInternshipIdAndStatusIn(Long internshipId, List<String> ststusList, Pageable pageable);

	long countByUserDetailUserId(Long userId);

	List<CareerUser> findByCareerJobIdAndStatusIn(Long id, List<String> ststusList, Pageable pageable);

	List<CareerUser> findByCareerProjectIdAndStatusIn(Long id, List<String> ststusList, Pageable pageable);

	List<CareerUser> findByCareerCertificationIdAndStatusIn(Long id, List<String> ststusList, Pageable pageable);

	CareerUser findByUserDetailUserIdAndCareerInternshipId(Long userId, Long internshipId);

	CareerUser findByUserDetailUserIdAndCareerJobId(Long userId, Long jobId);

	CareerUser findByUserDetailUserIdAndCareerCertificationId(Long userId, Long certificationId);

	CareerUser findByUserDetailUserIdAndCareerProjectId(Long userId, Long projectId);

	List<CareerUser> findByCareerInternshipIn(List<Internship> internships);

	List<CareerUser> findByCareerProjectIn(List<Project> projects);

	List<CareerUser> findByCareerJobIn(List<Job> jobs);

	List<CareerUser> findByCareerCertificationIn(List<Certification> certifications);
}