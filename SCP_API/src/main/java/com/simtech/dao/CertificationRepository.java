package com.simtech.dao;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.simtech.entity.Certification;

@Repository
public interface CertificationRepository
		extends JpaRepository<Certification, Long>, JpaSpecificationExecutor<Certification> {
	List<Certification> findByCareerTagsHashTagIdAndStatusOrderByCreatedDateDesc(Long tagId, String status,
			Pageable pageable);

}