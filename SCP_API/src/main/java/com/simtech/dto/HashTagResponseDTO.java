package com.simtech.dto;

import com.simtech.entity.HashTag;

public class HashTagResponseDTO {
	private HashTag hashTag;
	private Boolean isPrimary;

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

}
