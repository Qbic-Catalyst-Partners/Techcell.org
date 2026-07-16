package com.simtech.dto;

public class CommunityModeratorRequestDTO {

	private Long communityId;
	private Long moderator;

	public Long getCommunityId() {
		return communityId;
	}

	public void setCommunityId(Long communityId) {
		this.communityId = communityId;
	}

	public Long getModerator() {
		return moderator;
	}

	public void setModerator(Long moderator) {
		this.moderator = moderator;
	}

}
