package com.simtech.dto;

import com.simtech.dto.constant.ObjectStatus;

public class ApprovePostRequestDTO {
	private Long postingId;
	private ObjectStatus objectStatus;
	private String reason;

	public Long getPostingId() {
		return postingId;
	}

	public void setPostingId(Long postingId) {
		this.postingId = postingId;
	}

	public ObjectStatus getObjectStatus() {
		return objectStatus;
	}

	public void setObjectStatus(ObjectStatus objectStatus) {
		this.objectStatus = objectStatus;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}
}
