package com.simtech.dto;

import java.util.List;

import org.springframework.stereotype.Component;

import com.simtech.dto.constant.DocumentTypeEnum;

@Component
public class PostingSearchCriteria {

	private DocumentTypeEnum postType;
	private Boolean Myposting;
	private List<Long> tagList;

	public DocumentTypeEnum getPostType() {
		return postType;
	}

	public void setPostType(DocumentTypeEnum postType) {
		this.postType = postType;
	}

	public Boolean getMyposting() {
		return Myposting;
	}

	public void setMyposting(Boolean myposting) {
		Myposting = myposting;
	}

	public List<Long> getTagList() {
		return tagList;
	}

	public void setTagList(List<Long> tagList) {
		this.tagList = tagList;
	}

}
