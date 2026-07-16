package com.simtech.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;

@Entity
public class OrgDetail {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long orgId;
	private String orgName;
	private String contactNo;
	private String orgAddress;

	@Column(name = "AICTE_Code")
	private String AICTECode;
	private String city;
	private String state;

	// Corporate-specific fields
	private String cin; // Corporate Identification Number
	private String gstNumber;
	private String companyEmail;
	private String pincode;
	private String website;
	private String industryType;
	private String companySize;
	private Integer yearOfIncorporation;

	@Lob
	private byte[] logo; // company logo image blob

	private Boolean mcaRocVerified; // MCA/ROC verification flag
	private String registrationId;

	public Long getOrgId() {
		return orgId;
	}

	public void setOrgId(Long orgId) {
		this.orgId = orgId;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public String getContactNo() {
		return contactNo;
	}

	public void setContactNo(String contactNo) {
		this.contactNo = contactNo;
	}

	public String getOrgAddress() {
		return orgAddress;
	}

	public void setOrgAddress(String orgAddress) {
		this.orgAddress = orgAddress;
	}

	public String getAICTECode() {
		return AICTECode;
	}

	public void setAICTECode(String aICTECode) {
		AICTECode = aICTECode;
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

	public OrgDetail(Long orgId) {
		super();
		this.orgId = orgId;
	}

	public OrgDetail() {
		super();
	}

	// New getters and setters for corporate fields

	public String getCin() {
		return cin;
	}

	public void setCin(String cin) {
		this.cin = cin;
	}

	public String getGstNumber() {
		return gstNumber;
	}

	public void setGstNumber(String gstNumber) {
		this.gstNumber = gstNumber;
	}

	public String getCompanyEmail() {
		return companyEmail;
	}

	public void setCompanyEmail(String companyEmail) {
		this.companyEmail = companyEmail;
	}

	public String getPincode() {
		return pincode;
	}

	public void setPincode(String pincode) {
		this.pincode = pincode;
	}

	public String getWebsite() {
		return website;
	}

	public void setWebsite(String website) {
		this.website = website;
	}

	public String getIndustryType() {
		return industryType;
	}

	public void setIndustryType(String industryType) {
		this.industryType = industryType;
	}

	public String getCompanySize() {
		return companySize;
	}

	public void setCompanySize(String companySize) {
		this.companySize = companySize;
	}

	public Integer getYearOfIncorporation() {
		return yearOfIncorporation;
	}

	public void setYearOfIncorporation(Integer yearOfIncorporation) {
		this.yearOfIncorporation = yearOfIncorporation;
	}

	public byte[] getLogo() {
		return logo;
	}

	public void setLogo(byte[] logo) {
		this.logo = logo;
	}

	public Boolean getMcaRocVerified() {
		return mcaRocVerified;
	}

	public void setMcaRocVerified(Boolean mcaRocVerified) {
		this.mcaRocVerified = mcaRocVerified;
	}

	public String getRegistrationId() {
		return registrationId;
	}

	public void setRegistrationId(String registrationId) {
		this.registrationId = registrationId;
	}
}