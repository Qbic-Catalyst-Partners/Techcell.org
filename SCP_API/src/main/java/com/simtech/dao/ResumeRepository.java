package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.Resume;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
	Resume findByUserId(Long userId);

}