package com.simtech.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;

@Entity
public class Resume {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	private Long userId;

	private Date updatedDate;

	@Lob
	private String resumeData;

	@Lob
	private byte[] resumePhoto;

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

	public Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public String getResumeData() {
		return resumeData;
	}

	public void setResumeData(String resumeData) {
		this.resumeData = resumeData;
	}

	public byte[] getResumePhoto() {
		return resumePhoto;
	}

	public void setResumePhoto(byte[] resumePhoto) {
		this.resumePhoto = resumePhoto;
	}

}
