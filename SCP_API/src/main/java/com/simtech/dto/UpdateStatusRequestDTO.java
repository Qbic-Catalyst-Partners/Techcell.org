package com.simtech.dto;

import com.simtech.dto.constant.DocumentTypeEnum;

public class UpdateStatusRequestDTO {
	private DocumentTypeEnum careerType;
	private Long id;
	private String status;
	private String reason;

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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

}
