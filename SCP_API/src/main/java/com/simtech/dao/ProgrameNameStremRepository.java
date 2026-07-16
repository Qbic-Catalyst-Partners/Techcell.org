package com.simtech.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.ProgramStreamRelationship;

@Repository
public interface ProgrameNameStremRepository extends JpaRepository<ProgramStreamRelationship, Long> {
	List<ProgramStreamRelationship> findByOrgDetailOrgIdAndProgramNameId(Long orgId, Long programId);

}