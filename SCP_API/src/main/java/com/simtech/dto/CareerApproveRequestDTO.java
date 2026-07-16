package com.simtech.dto;

import com.simtech.dto.constant.DocumentTypeEnum;

public class CareerApproveRequestDTO {
	private DocumentTypeEnum careerType;
	private Long id;
	private Long userId;
	private String status;

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

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
