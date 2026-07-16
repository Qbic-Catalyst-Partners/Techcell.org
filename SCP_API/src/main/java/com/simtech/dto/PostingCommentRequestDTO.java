package com.simtech.dto;

public class PostingCommentRequestDTO {
	private Long postingId;
	private String content;
	private Long parentCommentId;

	// IDs of users mentioned in the comment (optional)
	private java.util.List<Long> mentions;

	public Long getPostingId() {
		return postingId;
	}

	public void setPostingId(Long postingId) {
		this.postingId = postingId;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Long getParentCommentId() {
		return parentCommentId;
	}

	public void setParentCommentId(Long parentCommentId) {
		this.parentCommentId = parentCommentId;
	}

	public java.util.List<Long> getMentions() {
		return mentions;
	}

	public void setMentions(java.util.List<Long> mentions) {
		this.mentions = mentions;
	}

}
