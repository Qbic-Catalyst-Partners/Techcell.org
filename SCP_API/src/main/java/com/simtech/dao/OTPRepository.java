package com.simtech.dao;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.OTP;

@Repository
public interface OTPRepository extends JpaRepository<OTP, Long> {
	OTP findByUserDetailUserIdAndOtpCodeAndExpiryTimeAfter(Long userId, String otpCode, Date currentTime);

	OTP findFirstByUserDetailUserIdAndOtpCodeAndSourceAndExpiryTimeAfterOrderByCreatedTimeDesc(Long userId,
																							   String otpCode, String Source, Date currentTime);

	void deleteByUserDetailUserId(Long userId);

}