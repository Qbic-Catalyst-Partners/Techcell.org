package com.simtech.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.RoleAccessRelationship;

@Repository
public interface RoleAccessRepository extends JpaRepository<RoleAccessRelationship, Long> {

	List<RoleAccessRelationship> findByRoleType(String roleType);

}