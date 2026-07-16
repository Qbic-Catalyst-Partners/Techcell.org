package com.simtech.dto;

import java.util.Date;

public class PostingCommentResponseDTO {
	private Long commentId;
	private UserDetailShortResponseDTO commentedUser;
	private String content;
	private Date commentTime;
	private Long parentCommentId;
	private Long replyCount;

	public UserDetailShortResponseDTO getCommentedUser() {
		return commentedUser;
	}

	public void setCommentedUser(UserDetailShortResponseDTO commentedUser) {
		this.commentedUser = commentedUser;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Date getCommentTime() {
		return commentTime;
	}

	public void setCommentTime(Date commentTime) {
		this.commentTime = commentTime;
	}

	public Long getCommentId() {
		return commentId;
	}

	public void setCommentId(Long commentId) {
		this.commentId = commentId;
	}

	public Long getParentCommentId() {
		return parentCommentId;
	}

	public void setParentCommentId(Long parentCommentId) {
		this.parentCommentId = parentCommentId;
	}

	public Long getReplyCount() {
		return replyCount;
	}

	public void setReplyCount(Long replyCount) {
		this.replyCount = replyCount;
	}

}
