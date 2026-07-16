package com.simtech.dto;

import com.simtech.entity.OrgDetail;

public class UserProfileResponseDTO {
	private UserDetailResponseDTO userDetailResponseDTO;
	private OrgDetail orgDetail;

	public UserDetailResponseDTO getUserDetailResponseDTO() {
		return userDetailResponseDTO;
	}

	public void setUserDetailResponseDTO(UserDetailResponseDTO userDetailResponseDTO) {
		this.userDetailResponseDTO = userDetailResponseDTO;
	}

	public OrgDetail getOrgDetail() {
		return orgDetail;
	}

	public void setOrgDetail(OrgDetail orgDetail) {
		this.orgDetail = orgDetail;
	}

}
