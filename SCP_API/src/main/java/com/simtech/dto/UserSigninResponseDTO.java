package com.simtech.dto;

import java.util.Date;

public class UserSigninResponseDTO {
	private UserDetailResponseDTO userDetailResponseDTO;
	private String token;
	private String refreshToken;
	private String orgName;
	private Date lastSignInDate;

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public UserDetailResponseDTO getUserDetailResponseDTO() {
		return userDetailResponseDTO;
	}

	public void setUserDetailResponseDTO(UserDetailResponseDTO userDetailResponseDTO) {
		this.userDetailResponseDTO = userDetailResponseDTO;
	}

	public String getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public Date getLastSignInDate() {
		return lastSignInDate;
	}

	public void setLastSignInDate(Date lastSignInDate) {
		this.lastSignInDate = lastSignInDate;
	}

}
