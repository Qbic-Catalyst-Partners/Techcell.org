package com.simtech.dto;

public class PostFeedRequestDTO extends PostBaseRequestDTO {

	private Long communityId;
	private String description;
	private Long contentPostingId;

	public Long getCommunityId() {
		return communityId;
	}

	public void setCommunityId(Long communityId) {
		this.communityId = communityId;
	}

	public Long getContentPostingId() {
		return contentPostingId;
	}

	public void setContentPostingId(Long contentPostingId) {
		this.contentPostingId = contentPostingId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
