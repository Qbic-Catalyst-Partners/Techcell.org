package com.simtech.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "career_tag_rltnp")
public class CareerTag {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	@JoinColumn(name = "internship_id", nullable = true)
	@JsonIgnore
	private Internship internship;

	@ManyToOne
	@JoinColumn(name = "job_id", nullable = true)
	@JsonIgnore
	private Job job;;

	@ManyToOne
	@JoinColumn(name = "project_id", nullable = true)
	@JsonIgnore
	private Project project;

	@ManyToOne
	@JoinColumn(name = "cert_id", nullable = true)
	@JsonIgnore
	private Certification certification;

	@OneToOne
	@JoinColumn(name = "tag_id", nullable = false)
	@JsonIgnore
	private HashTag hashTag;

	private Boolean isPrimary;

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

	public HashTag getHashTag() {
		return hashTag;
	}

	public void setHashTag(HashTag hashTag) {
		this.hashTag = hashTag;
	}

	public Boolean getIsPrimary() {
		return isPrimary;
	}

	public void setIsPrimary(Boolean isPrimary) {
		this.isPrimary = isPrimary;
	}

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
	}

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
	}

	public Certification getCertification() {
		return certification;
	}

	public void setCertification(Certification certification) {
		this.certification = certification;
	}

}