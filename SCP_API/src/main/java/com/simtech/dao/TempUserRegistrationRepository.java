package com.simtech.dao;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.TempUserRegistration;

@Repository
public interface TempUserRegistrationRepository extends JpaRepository<TempUserRegistration, Long> {

    TempUserRegistration findByEmailId(String emailId);

    List<TempUserRegistration> findByCreatedTimeBefore(Date date);

    List<TempUserRegistration> findByLastActivityTimeBefore(Date date);

    List<TempUserRegistration> findByEmailOtpVerifiedAndMobileOtpVerified(boolean emailVerified, boolean mobileVerified);
}