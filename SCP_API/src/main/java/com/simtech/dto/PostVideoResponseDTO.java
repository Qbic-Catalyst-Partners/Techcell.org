package com.simtech.dto;

public class PostVideoResponseDTO {

	private Long id;
	private String description;
	private String videoLink;
	private byte[] videocontent;

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public byte[] getVideocontent() {
		return videocontent;
	}

	public void setVideocontent(byte[] videocontent) {
		this.videocontent = videocontent;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getVideoLink() {
		return videoLink;
	}

	public void setVideoLink(String videoLink) {
		this.videoLink = videoLink;
	}

	public PostVideoResponseDTO(Long id, String description, String videoLink, byte[] videocontent) {
		super();
		this.id = id;
		this.description = description;
		this.videoLink = videoLink;
		this.videocontent = videocontent;
	}

}
