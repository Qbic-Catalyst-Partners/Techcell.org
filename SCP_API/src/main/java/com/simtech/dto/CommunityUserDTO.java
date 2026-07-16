package com.simtech.dto;

import java.util.Date;

public class CommunityUserDTO extends UserDetailShortResponseDTO {
	private Date joinedDate;

	public Date getJoinedDate() {
		return joinedDate;
	}

	public void setJoinedDate(Date joinedDate) {
		this.joinedDate = joinedDate;
	}

}
