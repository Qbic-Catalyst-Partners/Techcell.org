package com.simtech.dto;

public class PostVideoRequestDTO extends PostBaseRequestDTO {

	private String description;
	private String videolink;
	private byte[] videocontent;

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getVideolink() {
		return videolink;
	}

	public void setVideolink(String videolink) {
		this.videolink = videolink;
	}

	public byte[] getVideocontent() {
		return videocontent;
	}

	public void setVideocontent(byte[] videocontent) {
		this.videocontent = videocontent;
	}

}
