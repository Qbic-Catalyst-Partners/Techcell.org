package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.simtech.entity.UserDetail;

@Repository
public interface UserRepository extends JpaRepository<UserDetail, Long>, JpaSpecificationExecutor<UserDetail> {

	UserDetail findByUserId(Long userId);

	long countByRole(String role);

	java.util.List<UserDetail> findByRole(String role);

}