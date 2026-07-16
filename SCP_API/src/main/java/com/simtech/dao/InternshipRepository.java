package com.simtech.dao;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.simtech.entity.Internship;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long>, JpaSpecificationExecutor<Internship> {
	List<Internship> findByCareerTagsHashTagIdAndStatusOrderByCreatedDateDesc(Long tagId, String status,
			Pageable pageable);

}