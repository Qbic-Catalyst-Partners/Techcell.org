package com.simtech.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.OrgDetail;

@Repository
public interface OrgDetailRepository extends JpaRepository<OrgDetail, Long> {
	OrgDetail findByOrgId(Long orgId);

	OrgDetail findByAICTECode(String aicteCode);

	List<OrgDetail> findByOrgNameContaining(String orgName);

}