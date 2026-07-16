package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.OtpLess;

@Repository
public interface OTPLessRepository extends JpaRepository<OtpLess, Long> {
	OtpLess findByMobileNo(String mobNo);

}