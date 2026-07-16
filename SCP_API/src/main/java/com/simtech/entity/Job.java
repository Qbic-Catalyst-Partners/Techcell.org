package com.simtech.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Job {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String designation;
	@Column(name = "job_desc")
	private String desc;
	private String companyName;
	private String companyDesc;
	private String ContactNo;
	private String email;
	private String location;
	private String qualification;
	private Long experiance;
	/** Years, Months */
	@Column(name = "experiance_unit", length = 20)
	private String experianceUnit;
	private Date startDate;
	private Date endDate;
	private String ctc;
	@Column(name = "ctc_to")
	private String ctcTo;
	private String skills;
	private String jobType;
	private String status;
	private String reason;
	@Lob
	private byte[] companyLogo;
	@Lob
	private byte[] coverPage;
	@OneToOne
	@JoinColumn(name = "user_id", nullable = true)
	@JsonIgnore
	private UserDetail createdBy;

	private Date createdDate;
	private Date updatedDate;
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "job")
	@JsonIgnore
	private List<CareerTag> careerTags;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
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

	public Long getExperiance() {
		return experiance;
	}

	public void setExperiance(Long experiance) {
		this.experiance = experiance;
	}

	public String getExperianceUnit() {
		return experianceUnit;
	}

	public void setExperianceUnit(String experianceUnit) {
		this.experianceUnit = experianceUnit;
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

	public String getCtc() {
		return ctc;
	}

	public void setCtc(String ctc) {
		this.ctc = ctc;
	}

	public String getCtcTo() {
		return ctcTo;
	}

	public void setCtcTo(String ctcTo) {
		this.ctcTo = ctcTo;
	}

	public String getSkills() {
		return skills;
	}

	public void setSkills(String skills) {
		this.skills = skills;
	}

	public String getJobType() {
		return jobType;
	}

	public void setJobType(String jobType) {
		this.jobType = jobType;
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

	public UserDetail getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(UserDetail createdBy) {
		this.createdBy = createdBy;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public List<CareerTag> getCareerTags() {
		return careerTags;
	}

	public void setCareerTags(List<CareerTag> careerTags) {
		this.careerTags = careerTags;
	}

	public Job(Long id) {
		super();
		this.id = id;
	}

	public Job() {
		super();
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