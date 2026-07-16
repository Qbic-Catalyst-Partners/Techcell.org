package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.simtech.entity.ProjectTeam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProjectTeamRepository extends JpaRepository<ProjectTeam, Long> {

    long countByProject_IdAndStatus(Long projectId, String status);

    Page<ProjectTeam> findByProject_IdAndStatusIn(Long projectId, java.util.List<String> status, Pageable pageable);
} 