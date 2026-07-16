package com.simtech.dao;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.SoftwareTag;

@Repository
public interface SoftwareTagRepository extends JpaRepository<SoftwareTag, Long> {
	List<SoftwareTag> findByHashTagId(Long tagId, Pageable pageable);

}