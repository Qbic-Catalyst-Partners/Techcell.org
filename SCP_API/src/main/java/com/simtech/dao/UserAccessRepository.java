package com.simtech.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.UserAccessRelationship;

@Repository
public interface UserAccessRepository extends JpaRepository<UserAccessRelationship, Long> {

	List<UserAccessRelationship> findByUserDetailUserId(Long userId);

}