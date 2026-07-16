package com.simtech.dto;

public class OTPVerificationRequestDTO {

	private String emailId;
	private String emailOTP;
	private String mobileOTP;

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getEmailOTP() {
		return emailOTP;
	}

	public void setEmailOTP(String emailOTP) {
		this.emailOTP = emailOTP;
	}

	public String getMobileOTP() {
		return mobileOTP;
	}

	public void setMobileOTP(String mobileOTP) {
		this.mobileOTP = mobileOTP;
	}

}
