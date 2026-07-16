package com.simtech.dto;

import java.util.List;

import com.simtech.dto.constant.DocumentTypeEnum;

public class PostBaseRequestDTO {

	private String title;
	private String shortDescription;
	private Long primaryTag;
	private List<Long> tags;
	private DocumentTypeEnum postType;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getShortDescription() {
		return shortDescription;
	}

	public void setShortDescription(String shortDescription) {
		this.shortDescription = shortDescription;
	}

	public List<Long> getTags() {
		return tags;
	}

	public void setTags(List<Long> tags) {
		this.tags = tags;
	}

	public DocumentTypeEnum getPostType() {
		return postType;
	}

	public void setPostType(DocumentTypeEnum postType) {
		this.postType = postType;
	}

	public Long getPrimaryTag() {
		return primaryTag;
	}

	public void setPrimaryTag(Long primaryTag) {
		this.primaryTag = primaryTag;
	}

}
