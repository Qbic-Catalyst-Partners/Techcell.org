package com.simtech.dto;

import java.util.Date;

import com.simtech.dto.constant.DocumentTypeEnum;

public class UserDocumentRequestDTO {

	private Long orgId;
	private DocumentTypeEnum documentType;
	private String documentContentType;
	private byte[] document;
	private Long userId;
	private String fileName;
	private String description;
	private Date effectiveDate;

	public Long getOrgId() {
		return orgId;
	}

	public void setOrgId(Long orgId) {
		this.orgId = orgId;
	}

	public DocumentTypeEnum getDocumentType() {
		return documentType;
	}

	public void setDocumentType(DocumentTypeEnum documentType) {
		this.documentType = documentType;
	}

	public String getDocumentContentType() {
		return documentContentType;
	}

	public void setDocumentContentType(String documentContentType) {
		this.documentContentType = documentContentType;
	}

	public byte[] getDocument() {
		return document;
	}

	public void setDocument(byte[] document) {
		this.document = document;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getEffectiveDate() {
		return effectiveDate;
	}

	public void setEffectiveDate(Date effectiveDate) {
		this.effectiveDate = effectiveDate;
	}

}
