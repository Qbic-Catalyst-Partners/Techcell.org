package com.simtech.dto;

public class PostFeedResponseDTO {

	private Long feedId;
	private String description;
	private PostingResponseDTO postingResponseDTO;

	public Long getFeedId() {
		return feedId;
	}

	public void setFeedId(Long feedId) {
		this.feedId = feedId;
	}

	public PostingResponseDTO getPostingResponseDTO() {
		return postingResponseDTO;
	}

	public void setPostingResponseDTO(PostingResponseDTO postingResponseDTO) {
		this.postingResponseDTO = postingResponseDTO;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public PostFeedResponseDTO(Long feedId, String description, PostingResponseDTO postingResponseDTO) {
		super();
		this.feedId = feedId;
		this.description = description;
		this.postingResponseDTO = postingResponseDTO;
	}

}
