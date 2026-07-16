package com.simtech.dto;

import java.util.Date;

public class CommunityUserResponseDTO {
	private PostCommunityResponseDTO postCommunityResponseDTO;
	private Date joinedDate;
	private Long postingId;

	public PostCommunityResponseDTO getPostCommunityResponseDTO() {
		return postCommunityResponseDTO;
	}

	public void setPostCommunityResponseDTO(PostCommunityResponseDTO postCommunityResponseDTO) {
		this.postCommunityResponseDTO = postCommunityResponseDTO;
	}

	public Date getJoinedDate() {
		return joinedDate;
	}

	public void setJoinedDate(Date joinedDate) {
		this.joinedDate = joinedDate;
	}

	public Long getPostingId() {
		return postingId;
	}

	public void setPostingId(Long postingId) {
		this.postingId = postingId;
	}

}
