package com.simtech.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.OrgProgramRelationship;

@Repository
public interface OrgProgramNameRepository extends JpaRepository<OrgProgramRelationship, Long> {

	List<OrgProgramRelationship> findByOrgDetailOrgId(Long orgId);

	OrgProgramRelationship findByProgramId(Long programId);
}