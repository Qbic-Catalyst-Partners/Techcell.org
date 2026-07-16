package com.simtech.service;

import com.simtech.dto.UserCreateDTO;
import com.simtech.dto.OTPVerificationRequestDTO;
import com.simtech.entity.TempUserRegistration;
import com.simtech.entity.UserDetail;

public interface TempUserRegistrationService {

    /**
     * Creates a temporary user registration record
     * @param userCreateDTO The user creation data
     * @return The created temporary registration
     */
    TempUserRegistration createTempRegistration(UserCreateDTO userCreateDTO);

    /**
     * Updates OTP verification status
     * @param otpVerificationRequestDTO The OTP verification data
     * @return The updated temporary registration
     */
    TempUserRegistration updateOtpVerification(OTPVerificationRequestDTO otpVerificationRequestDTO);

    /**
     * Checks if both OTPs (email and mobile) are verified
     * @param emailId The user's email ID
     * @return true if both OTPs are verified, false otherwise
     */
    boolean areBothOtpsVerified(String emailId);

    /**
     * Creates a permanent user record from the temporary registration
     * @param emailId The user's email ID
     * @return The created UserDetail
     */
    UserDetail createPermanentUser(String emailId);

    /**
     * Deletes a temporary registration
     * @param emailId The user's email ID
     */
    void deleteTempRegistration(String emailId);

    /**
     * Updates the last activity timestamp
     * @param emailId The user's email ID
     */
    void updateLastActivity(String emailId);
}