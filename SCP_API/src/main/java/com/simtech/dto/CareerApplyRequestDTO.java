package com.simtech.dto;

import java.util.List;

import com.simtech.dto.constant.DocumentTypeEnum;

public class CareerApplyRequestDTO {
	private DocumentTypeEnum careerType;
	private Long id;
	List<Long> teamMembersUserId;

	// For project applications: list of team member emails (may include unregistered users)
	List<String> teamMemberEmails;

	public DocumentTypeEnum getCareerType() {
		return careerType;
	}

	public void setCareerType(DocumentTypeEnum careerType) {
		this.careerType = careerType;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public List<Long> getTeamMembersUserId() {
		return teamMembersUserId;
	}

	public void setTeamMembersUserId(List<Long> teamMembersUserId) {
		this.teamMembersUserId = teamMembersUserId;
	}

	public List<String> getTeamMemberEmails() {
		return teamMemberEmails;
	}

	public void setTeamMemberEmails(List<String> teamMemberEmails) {
		this.teamMemberEmails = teamMemberEmails;
	}

}
