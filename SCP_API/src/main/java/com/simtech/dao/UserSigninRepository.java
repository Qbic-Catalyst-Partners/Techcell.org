package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.UserSignin;

@Repository
public interface UserSigninRepository extends JpaRepository<UserSignin, Long> {

	UserSignin findByUserNameAndPassword(String userName, String password);

	UserSignin findByUserDetailUserId(Long userId);

	UserSignin findByUserName(String userName);

}