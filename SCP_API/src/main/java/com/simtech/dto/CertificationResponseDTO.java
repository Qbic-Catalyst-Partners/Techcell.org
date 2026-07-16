package com.simtech.dto;

import java.util.Date;
import java.util.List;

public class CertificationResponseDTO {

	private Long certificationId;
	private String eligibility;
	private String field;
	private Integer duration;
	private String durationUnit;
	private String mode;
	private Double certFee;

	private String title;
	private String desc;
	private String ContactNo;
	private String email;
	private Date startDate;
	private Date endDate;
	private byte[] certLogo;
	private byte[] coverPage;
	private List<HashTagResponseDTO> tags;
	private Date createdDate;
	private Date updateddDate;
	private boolean applied;
	private String status;
	private String reason;

	private long appliedCount;
	private long selectedCount;
	private long rejectedCount;

	public Long getCertificationId() {
		return certificationId;
	}

	public void setCertificationId(Long certificationId) {
		this.certificationId = certificationId;
	}

	public String getEligibility() {
		return eligibility;
	}

	public void setEligibility(String eligibility) {
		this.eligibility = eligibility;
	}

	public String getField() {
		return field;
	}

	public void setField(String field) {
		this.field = field;
	}

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	public String getDurationUnit() {
		return durationUnit;
	}

	public void setDurationUnit(String durationUnit) {
		this.durationUnit = durationUnit;
	}

	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	public Double getCertFee() {
		return certFee;
	}

	public void setCertFee(Double certFee) {
		this.certFee = certFee;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getContactNo() {
		return ContactNo;
	}

	public void setContactNo(String contactNo) {
		ContactNo = contactNo;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public byte[] getCertLogo() {
		return certLogo;
	}

	public void setCertLogo(byte[] certLogo) {
		this.certLogo = certLogo;
	}

	public byte[] getCoverPage() {
		return coverPage;
	}

	public void setCoverPage(byte[] coverPage) {
		this.coverPage = coverPage;
	}

	public List<HashTagResponseDTO> getTags() {
		return tags;
	}

	public void setTags(List<HashTagResponseDTO> tags) {
		this.tags = tags;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getUpdateddDate() {
		return updateddDate;
	}

	public void setUpdateddDate(Date updateddDate) {
		this.updateddDate = updateddDate;
	}

	public boolean isApplied() {
		return applied;
	}

	public void setApplied(boolean applied) {
		this.applied = applied;
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

	public long getAppliedCount() {
		return appliedCount;
	}

	public void setAppliedCount(long appliedCount) {
		this.appliedCount = appliedCount;
	}

	public long getSelectedCount() {
		return selectedCount;
	}

	public void setSelectedCount(long selectedCount) {
		this.selectedCount = selectedCount;
	}

	public long getRejectedCount() {
		return rejectedCount;
	}

	public void setRejectedCount(long rejectedCount) {
		this.rejectedCount = rejectedCount;
	}

}
