package com.simtech.dto;

import java.util.Date;
import java.util.List;

public class CertificationRequestDTO {
	private String eligibility;
	private String field;
	private String mode;
	private Double certFee;
	private byte[] certLogo;
	private String title;
	private String desc;
	private String ContactNo;
	private String email;
	private Integer duration;
	private String durationUnit;
	private Date startDate;
	private Date endDate;
	private byte[] coverPage;
	private List<Long> tags;

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

	public byte[] getCertLogo() {
		return certLogo;
	}

	public void setCertLogo(byte[] certLogo) {
		this.certLogo = certLogo;
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

	public byte[] getCoverPage() {
		return coverPage;
	}

	public void setCoverPage(byte[] coverPage) {
		this.coverPage = coverPage;
	}

	public List<Long> getTags() {
		return tags;
	}

	public void setTags(List<Long> tags) {
		this.tags = tags;
	}

}
