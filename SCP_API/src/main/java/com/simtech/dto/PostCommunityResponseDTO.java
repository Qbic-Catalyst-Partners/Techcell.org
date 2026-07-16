package com.simtech.dto;

import java.util.Date;

public class PostCommunityResponseDTO {

	private Long id;
	private String title;
	private String description;
	private byte[] profilePhoto;
	private byte[] coverPhoto;
	private boolean isActive;
	private Date createdDate;
	private Long activeMemberCount;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public byte[] getProfilePhoto() {
		return profilePhoto;
	}

	public void setProfilePhoto(byte[] profilePhoto) {
		this.profilePhoto = profilePhoto;
	}

	public byte[] getCoverPhoto() {
		return coverPhoto;
	}

	public void setCoverPhoto(byte[] coverPhoto) {
		this.coverPhoto = coverPhoto;
	}

	public boolean isActive() {
		return isActive;
	}

	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Long getActiveMemberCount() {
		return activeMemberCount;
	}

	public void setActiveMemberCount(Long activeMemberCount) {
		this.activeMemberCount = activeMemberCount;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public PostCommunityResponseDTO(Long id, String title, String description, byte[] profilePhoto, byte[] coverPhoto,
			Date createdDate, Long activeMemberCount) {
		super();
		this.id = id;
		this.title = title;
		this.description = description;
		this.profilePhoto = profilePhoto;
		this.coverPhoto = coverPhoto;
		this.createdDate = createdDate;
		this.activeMemberCount = activeMemberCount;
	}

	public PostCommunityResponseDTO() {
		super();
	}

}
