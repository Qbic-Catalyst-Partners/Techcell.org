package com.simtech.entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.OneToOne;

@Entity
public class TempUserRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String emailId;
    private String mobileNo;
    private String password;
    private String role;
    private String gender;
    private Date dob;
    private Date effectiveDate;
    private Date graduationCompletiondate;
    private String idNumber;
    private String programName;
    private String courseLevel;
    private String stream;

    private boolean emailOtpVerified;
    private boolean mobileOtpVerified;

    private Date createdTime;
    private Date lastActivityTime;

    private String designation;
    private String qualification;
    private String domailExp;
    private String currentCompany;
    private String workExp;
    private String linkedinProfile;
    private String city;
    private String state;
    private String description;

    @Lob
    private byte[] profilePhoto;

    @Lob
    private byte[] IdProof;

    @OneToOne
    @JoinColumn(name = "org_id", nullable = true)
    private OrgDetail orgDetail;

    @OneToOne
    @JoinColumn(name = "question_id", nullable = false)
    private SecurityQuestion securityQuestion;

    private String securityAns;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public Date getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(Date effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public Date getGraduationCompletiondate() {
        return graduationCompletiondate;
    }

    public void setGraduationCompletiondate(Date graduationCompletiondate) {
        this.graduationCompletiondate = graduationCompletiondate;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public String getProgramName() {
        return programName;
    }

    public void setProgramName(String programName) {
        this.programName = programName;
    }

    public String getCourseLevel() {
        return courseLevel;
    }

    public void setCourseLevel(String courseLevel) {
        this.courseLevel = courseLevel;
    }

    public String getStream() {
        return stream;
    }

    public void setStream(String stream) {
        this.stream = stream;
    }

    public boolean isEmailOtpVerified() {
        return emailOtpVerified;
    }

    public void setEmailOtpVerified(boolean emailOtpVerified) {
        this.emailOtpVerified = emailOtpVerified;
    }

    public boolean isMobileOtpVerified() {
        return mobileOtpVerified;
    }

    public void setMobileOtpVerified(boolean mobileOtpVerified) {
        this.mobileOtpVerified = mobileOtpVerified;
    }

    public Date getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Date createdTime) {
        this.createdTime = createdTime;
    }

    public Date getLastActivityTime() {
        return lastActivityTime;
    }

    public void setLastActivityTime(Date lastActivityTime) {
        this.lastActivityTime = lastActivityTime;
    }

    public byte[] getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(byte[] profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public byte[] getIdProof() {
        return IdProof;
    }

    public void setIdProof(byte[] idProof) {
        IdProof = idProof;
    }

    public OrgDetail getOrgDetail() {
        return orgDetail;
    }

    public void setOrgDetail(OrgDetail orgDetail) {
        this.orgDetail = orgDetail;
    }

    public SecurityQuestion getSecurityQuestion() {
        return securityQuestion;
    }

    public void setSecurityQuestion(SecurityQuestion securityQuestion) {
        this.securityQuestion = securityQuestion;
    }

    public String getSecurityAns() {
        return securityAns;
    }

    public void setSecurityAns(String securityAns) {
        this.securityAns = securityAns;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getDomailExp() {
        return domailExp;
    }

    public void setDomailExp(String domailExp) {
        this.domailExp = domailExp;
    }

    public String getCurrentCompany() {
        return currentCompany;
    }

    public void setCurrentCompany(String currentCompany) {
        this.currentCompany = currentCompany;
    }

    public String getWorkExp() {
        return workExp;
    }

    public void setWorkExp(String workExp) {
        this.workExp = workExp;
    }

    public String getLinkedinProfile() {
        return linkedinProfile;
    }

    public void setLinkedinProfile(String linkedinProfile) {
        this.linkedinProfile = linkedinProfile;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}