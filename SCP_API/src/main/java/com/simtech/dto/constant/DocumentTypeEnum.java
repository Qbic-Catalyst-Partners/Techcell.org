package com.simtech.dto.constant;

public enum DocumentTypeEnum {

	VIDEOS("Videos"), BLOGS("Blogs"), COMMUNITY("Community"), FEED("Feed"), PROFILE_PHOTO("Profile_Photo"),
	STUDENT_ID("Student_Id"), INTERNSHIP("Internship"), JOB("Job"), PROJECT("Project"), CERTIFICATION("Certification"),
	SOFTWARE("Software"), USER("user");

	String code = "";

	DocumentTypeEnum(String code) {
		this.code = code;
	}

	public String getCode() {
		return code;
	}

	public static DocumentTypeEnum parseEncodeValue(String Value) {
		DocumentTypeEnum result = null;
		for (final DocumentTypeEnum type : DocumentTypeEnum.values()) {
			if (type.getCode().equals(Value)) {
				result = type;
				break;
			}
		}
		return result;
	}

}
