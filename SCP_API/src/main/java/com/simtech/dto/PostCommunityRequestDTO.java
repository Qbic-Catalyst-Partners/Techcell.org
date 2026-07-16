package com.simtech.dto;

public class PostCommunityRequestDTO extends PostBaseRequestDTO {

	private String description;
	private byte[] profilePhoto;
	private byte[] coverPhoto;
	private Long moderator;

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

	public Long getModerator() {
		return moderator;
	}

	public void setModerator(Long moderator) {
		this.moderator = moderator;
	}

}
