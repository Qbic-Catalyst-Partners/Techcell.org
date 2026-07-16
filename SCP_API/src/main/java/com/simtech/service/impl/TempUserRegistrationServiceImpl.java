package com.simtech.service.impl;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.simtech.dao.TempUserRegistrationRepository;
import com.simtech.dao.OrgDetailRepository;
import com.simtech.dao.UserRepository;
import com.simtech.dao.UserSigninRepository;
import com.simtech.dto.OTPVerificationRequestDTO;
import com.simtech.dto.UserCreateDTO;
import com.simtech.entity.OrgDetail;
import com.simtech.entity.SecurityQuestion;
import com.simtech.entity.TempUserRegistration;
import com.simtech.entity.UserDetail;
import com.simtech.entity.UserSignin;
import com.simtech.exception.BusinessException;
import com.simtech.service.TempUserRegistrationService;
import com.simtech.util.EncryptDecryptUtil;

@Service
public class TempUserRegistrationServiceImpl implements TempUserRegistrationService {

    private static final Logger logger = LoggerFactory.getLogger(TempUserRegistrationServiceImpl.class);

    @Autowired
    private TempUserRegistrationRepository tempUserRegistrationRepository;

    @Autowired
    private OrgDetailRepository orgDetailRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSigninRepository userSigninRepository;

    @Autowired
    private EncryptDecryptUtil encryptDecryptUtil;

    @Override
    @Transactional
    public TempUserRegistration createTempRegistration(UserCreateDTO userCreateDTO) {
        // Check if email already exists in permanent user records
        UserSignin existingSignin = userSigninRepository.findByUserName(userCreateDTO.getEmailId());
        if (existingSignin != null) {
            throw new BusinessException("Duplicateemail", userCreateDTO.getEmailId());
        }

        // Check if email already exists in temporary registrations
        TempUserRegistration existingTemp = tempUserRegistrationRepository.findByEmailId(userCreateDTO.getEmailId());
        if (existingTemp != null) {
            // Delete existing temp registration and create a new one
            tempUserRegistrationRepository.delete(existingTemp);
        }

        // Create new temporary registration
        TempUserRegistration tempRegistration = new TempUserRegistration();
        tempRegistration.setFirstName(userCreateDTO.getFirstName());
        tempRegistration.setLastName(userCreateDTO.getLastName());
        tempRegistration.setEmailId(userCreateDTO.getEmailId());
        tempRegistration.setMobileNo(encryptDecryptUtil.encrypt(userCreateDTO.getMobileNo()));
        tempRegistration.setPassword(encryptDecryptUtil.encrypt(userCreateDTO.getPassword()));
        tempRegistration.setRole(userCreateDTO.getRole());
        tempRegistration.setGender(userCreateDTO.getGender());
        tempRegistration.setDob(userCreateDTO.getDob());
        tempRegistration.setEffectiveDate(userCreateDTO.getEffectiveDate() == null ? new Date() : userCreateDTO.getEffectiveDate());
        tempRegistration.setGraduationCompletiondate(userCreateDTO.getGraduationCompletiondate());
        tempRegistration.setIdNumber(userCreateDTO.getStudentId() != null ? userCreateDTO.getStudentId() : userCreateDTO.getFacultyId());
        tempRegistration.setProgramName(userCreateDTO.getProgramName());
        tempRegistration.setCourseLevel(userCreateDTO.getCourseLevel());
        tempRegistration.setStream(userCreateDTO.getStream());
        tempRegistration.setSecurityQuestion(new SecurityQuestion(userCreateDTO.getQuestionId()));
        tempRegistration.setSecurityAns(userCreateDTO.getSecurityQuestionAns());
        tempRegistration.setProfilePhoto(userCreateDTO.getProfilePhoto());
        tempRegistration.setIdProof(userCreateDTO.getIdProof());

        // Handle organisation details
        if (userCreateDTO.getOrgId() != null) {
            tempRegistration.setOrgDetail(new OrgDetail(userCreateDTO.getOrgId()));
        } else if ("Corporate".equalsIgnoreCase(userCreateDTO.getRole())) {
            // Create a new organisation record for corporate user
            OrgDetail org = new OrgDetail();
            org.setOrgName(userCreateDTO.getOrgName());
            org.setCin(userCreateDTO.getCin());
            org.setGstNumber(userCreateDTO.getGstNumber());
            org.setCompanyEmail(userCreateDTO.getCompanyEmail());
            org.setContactNo(userCreateDTO.getCompanyPhoneNumber());
            org.setOrgAddress(userCreateDTO.getOrgAddress());
            org.setCity(userCreateDTO.getCity());
            org.setState(userCreateDTO.getState());
            org.setPincode(userCreateDTO.getPincode());
            org.setWebsite(userCreateDTO.getWebsite());
            org.setIndustryType(userCreateDTO.getIndustryType());
            org.setCompanySize(userCreateDTO.getCompanySize());
            org.setYearOfIncorporation(userCreateDTO.getYearOfIncorporation());
            org.setLogo(userCreateDTO.getLogo());
            org.setMcaRocVerified(userCreateDTO.getMcaRocVerified());
            org.setRegistrationId(userCreateDTO.getRegistrationId());

            org = orgDetailRepository.save(org);
            tempRegistration.setOrgDetail(org);
        }

        // Initialize OTP verification flags
        tempRegistration.setEmailOtpVerified(false);
        tempRegistration.setMobileOtpVerified(false);

        // Set timestamps
        Date now = new Date();
        tempRegistration.setCreatedTime(now);
        tempRegistration.setLastActivityTime(now);

        // Additional fields
        tempRegistration.setDesignation(userCreateDTO.getDesignation());
        tempRegistration.setQualification(userCreateDTO.getQualification());
        tempRegistration.setDomailExp(userCreateDTO.getDomailExp());
        tempRegistration.setCurrentCompany(userCreateDTO.getCurrentCompany());
        tempRegistration.setWorkExp(userCreateDTO.getWorkExp());
        tempRegistration.setLinkedinProfile(userCreateDTO.getLinkedinProfile());
        tempRegistration.setCity(userCreateDTO.getCity());
        tempRegistration.setState(userCreateDTO.getState());
        tempRegistration.setDescription(userCreateDTO.getDescription());

        return tempUserRegistrationRepository.save(tempRegistration);
    }

    @Override
    @Transactional
    public TempUserRegistration updateOtpVerification(OTPVerificationRequestDTO otpVerificationRequestDTO) {
        TempUserRegistration tempRegistration = tempUserRegistrationRepository.findByEmailId(otpVerificationRequestDTO.getEmailId());

        if (tempRegistration == null) {
            throw new BusinessException("invalidUserName");
        }

        // Update verification flags based on provided OTPs
        if (otpVerificationRequestDTO.getEmailOTP() != null) {
            tempRegistration.setEmailOtpVerified(true);
        }

        if (otpVerificationRequestDTO.getMobileOTP() != null) {
            tempRegistration.setMobileOtpVerified(true);
        }

        // Update last activity timestamp
        tempRegistration.setLastActivityTime(new Date());

        return tempUserRegistrationRepository.save(tempRegistration);
    }

    @Override
    public boolean areBothOtpsVerified(String emailId) {
        TempUserRegistration tempRegistration = tempUserRegistrationRepository.findByEmailId(emailId);

        if (tempRegistration == null) {
            return false;
        }

        return tempRegistration.isEmailOtpVerified() && tempRegistration.isMobileOtpVerified();
    }

    @Override
    @Transactional
    public UserDetail createPermanentUser(String emailId) {
        TempUserRegistration tempRegistration = tempUserRegistrationRepository.findByEmailId(emailId);

        if (tempRegistration == null) {
            throw new BusinessException("invalidUserName");
        }

        // Check if both OTPs are verified
        if (!tempRegistration.isEmailOtpVerified() || !tempRegistration.isMobileOtpVerified()) {
            throw new BusinessException("OTP verification incomplete");
        }

        // Create permanent user record
        UserDetail userDetail = new UserDetail();
        userDetail.setFirstName(tempRegistration.getFirstName());
        userDetail.setLastName(tempRegistration.getLastName());
        userDetail.setEmailId(encryptDecryptUtil.encrypt(tempRegistration.getEmailId()));
        userDetail.setMobileNo(tempRegistration.getMobileNo()); // Already encrypted
        userDetail.setRole(tempRegistration.getRole());
        userDetail.setGender(tempRegistration.getGender());
        userDetail.setDob(tempRegistration.getDob());
        userDetail.setEffectiveDate(tempRegistration.getEffectiveDate());
        userDetail.setGraduationCompletiondate(tempRegistration.getGraduationCompletiondate());
        userDetail.setIdNumber(tempRegistration.getIdNumber());
        userDetail.setProgramName(tempRegistration.getProgramName());
        userDetail.setCourseLevel(tempRegistration.getCourseLevel());
        userDetail.setStream(tempRegistration.getStream());
        userDetail.setSecurityQuestion(tempRegistration.getSecurityQuestion());
        userDetail.setSecurityAns(tempRegistration.getSecurityAns());
        userDetail.setProfilePhoto(tempRegistration.getProfilePhoto());
        userDetail.setIdProof(tempRegistration.getIdProof());
        userDetail.setOrgDetail(tempRegistration.getOrgDetail());
        if ("Corporate".equalsIgnoreCase(tempRegistration.getRole())) {
            // Corporate users start as InActive and payment is considered received by default
            userDetail.setStatus("InActive");
            userDetail.setPaymentReceived(true);
        } else {
        userDetail.setStatus("Active");
            // Students need to pay, others don't (handled elsewhere)
            userDetail.setPaymentReceived(!"Student".equalsIgnoreCase(tempRegistration.getRole()));
        }

        // Set OTP verification flag to true
        userDetail.setOtpVerified(true);

        // Additional fields
        userDetail.setDesignation(tempRegistration.getDesignation());
        userDetail.setQualification(tempRegistration.getQualification());
        userDetail.setDomailExp(tempRegistration.getDomailExp());
        userDetail.setCurrentCompany(tempRegistration.getCurrentCompany());
        userDetail.setWorkExp(tempRegistration.getWorkExp());
        userDetail.setLinkedinProfile(tempRegistration.getLinkedinProfile());
        userDetail.setCity(tempRegistration.getCity());
        userDetail.setState(tempRegistration.getState());
        userDetail.setDescription(tempRegistration.getDescription());

        // Save user detail
        userDetail = userRepository.save(userDetail);

        // Create user signin record
        UserSignin userSignin = new UserSignin();
        userSignin.setUserName(tempRegistration.getEmailId());
        userSignin.setPassword(tempRegistration.getPassword()); // Already encrypted
        userSignin.setUserDetail(userDetail);
        userSignin.setLastSignInDate(new Date());

        userSigninRepository.save(userSignin);

        return userDetail;
    }

    @Override
    @Transactional
    public void deleteTempRegistration(String emailId) {
        TempUserRegistration tempRegistration = tempUserRegistrationRepository.findByEmailId(emailId);

        if (tempRegistration != null) {
            tempUserRegistrationRepository.delete(tempRegistration);
        }
    }

    @Override
    @Transactional
    public void updateLastActivity(String emailId) {
        TempUserRegistration tempRegistration = tempUserRegistrationRepository.findByEmailId(emailId);

        if (tempRegistration != null) {
            tempRegistration.setLastActivityTime(new Date());
            tempUserRegistrationRepository.save(tempRegistration);
        }
    }
}