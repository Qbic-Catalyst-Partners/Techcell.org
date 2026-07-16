package com.simtech.dto;

public class MaintainResumeRequestDTO {

	private Object resumeData;

	private byte[] resumePhoto;

	public Object getResumeData() {
		return resumeData;
	}

	public void setResumeData(Object resumeData) {
		this.resumeData = resumeData;
	}

	public byte[] getResumePhoto() {
		return resumePhoto;
	}

	public void setResumePhoto(byte[] resumePhoto) {
		this.resumePhoto = resumePhoto;
	}

}
