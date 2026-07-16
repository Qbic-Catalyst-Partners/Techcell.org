package com.simtech.dto;

import java.util.Date;
import java.util.List;

public class InternshipResponseDTO {

	private Long internshipId;
	private String title;
	private String desc;
	private String companyName;
	private String companyDesc;
	private String ContactNo;
	private String email;
	private String location;
	private String qualification;
	private Double duration;
	private String durationUnit;
	private Date startDate;
	private Date endDate;
	private double stipend;
	private byte[] companyLogo;
	private byte[] coverPage;
	private List<HashTagResponseDTO> tags;
	private Date createdDate;
	private Date updateddDate;
	private String skills;
	private boolean applied;
	private String status;
	private String reason;
	private long appliedCount;
	private long selectedCount;
	private long rejectedCount;

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

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getCompanyDesc() {
		return companyDesc;
	}

	public void setCompanyDesc(String companyDesc) {
		this.companyDesc = companyDesc;
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

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getQualification() {
		return qualification;
	}

	public void setQualification(String qualification) {
		this.qualification = qualification;
	}

	public Double getDuration() {
		return duration;
	}

	public void setDuration(Double duration) {
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

	public double getStipend() {
		return stipend;
	}

	public void setStipend(double stipend) {
		this.stipend = stipend;
	}

	public byte[] getCompanyLogo() {
		return companyLogo;
	}

	public void setCompanyLogo(byte[] companyLogo) {
		this.companyLogo = companyLogo;
	}

	public byte[] getCoverPage() {
		return coverPage;
	}

	public void setCoverPage(byte[] coverPage) {
		this.coverPage = coverPage;
	}

	public Long getInternshipId() {
		return internshipId;
	}

	public void setInternshipId(Long internshipId) {
		this.internshipId = internshipId;
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

	public String getSkills() {
		return skills;
	}

	public void setSkills(String skills) {
		this.skills = skills;
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
