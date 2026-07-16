package com.simtech.dto;

public class VerifySecurityQuestionReqDTO {
	private String emailId;
	private String ans;

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getAns() {
		return ans;
	}

	public void setAns(String ans) {
		this.ans = ans;
	}

}
