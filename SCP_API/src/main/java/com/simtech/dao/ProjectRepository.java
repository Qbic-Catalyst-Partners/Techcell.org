package com.simtech.dao;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.simtech.entity.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {
	List<Project> findByCareerTagsHashTagIdAndStatusOrderByCreatedDateDesc(Long tagId, String status,
			Pageable pageable);

}