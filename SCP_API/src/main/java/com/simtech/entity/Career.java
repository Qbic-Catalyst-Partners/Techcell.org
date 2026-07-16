package com.simtech.entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "CAREER")
public class Career {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(optional = true, fetch = FetchType.LAZY)
	@JoinColumn(name = "internship_id", nullable = true)
	@JsonIgnore
	private Internship internship;

	@OneToOne(optional = true, fetch = FetchType.LAZY)
	@JoinColumn(name = "job_id", nullable = true)
	@JsonIgnore
	private Job job;

	@OneToOne(optional = true, fetch = FetchType.LAZY)
	@JoinColumn(name = "project_id", nullable = true)
	@JsonIgnore
	private Project project;

	@OneToOne(optional = true, fetch = FetchType.LAZY)
	@JoinColumn(name = "cert_id", nullable = true)
	@JsonIgnore
	private Certification certification;

	private String careerType;
	private Date createdDate;
	private String status;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Internship getInternship() {
		return internship;
	}

	public void setInternship(Internship internship) {
		this.internship = internship;
	}

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Career(Long id) {
		super();
		this.id = id;
	}

	public Career() {
		super();
	}

	public String getCareerType() {
		return careerType;
	}

	public void setCareerType(String careerType) {
		this.careerType = careerType;
	}

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Certification getCertification() {
		return certification;
	}

	public void setCertification(Certification certification) {
		this.certification = certification;
	}

}