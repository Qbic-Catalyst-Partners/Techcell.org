package com.simtech.dto;

public class CareerAppliedDTO {
	private UserDetailShortResponseDTO userDetail;
	private String status;
	private Long teamId;
	private java.util.List<UserDetailShortResponseDTO> members;

	public UserDetailShortResponseDTO getUserDetail() {
		return userDetail;
	}

	public void setUserDetail(UserDetailShortResponseDTO userDetail) {
		this.userDetail = userDetail;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Long getTeamId() {
		return teamId;
	}

	public void setTeamId(Long teamId) {
		this.teamId = teamId;
	}

	public java.util.List<UserDetailShortResponseDTO> getMembers() {
		return members;
	}

	public void setMembers(java.util.List<UserDetailShortResponseDTO> members) {
		this.members = members;
	}

}
