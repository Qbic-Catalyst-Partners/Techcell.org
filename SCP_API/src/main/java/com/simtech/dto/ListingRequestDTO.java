package com.simtech.dto;

import java.util.List;

import com.simtech.dto.constant.DocumentTypeEnum;

public class ListingRequestDTO {
	DocumentTypeEnum documentTypeEnum;
	int page;
	int size;
	String sortBy;
	String direction;

	List<FilterRequestDTO> filters;

	public ListingRequestDTO() {
		super();
		this.page = 0;
		this.size = 10;
		this.sortBy = "createdDate";
		this.direction = "desc";
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public String getSortBy() {
		return sortBy;
	}

	public void setSortBy(String sortBy) {
		this.sortBy = sortBy;
	}

	public String getDirection() {
		return direction;
	}

	public void setDirection(String direction) {
		this.direction = direction;
	}

	public DocumentTypeEnum getDocumentTypeEnum() {
		return documentTypeEnum;
	}

	public void setDocumentTypeEnum(DocumentTypeEnum documentTypeEnum) {
		this.documentTypeEnum = documentTypeEnum;
	}

	public List<FilterRequestDTO> getFilters() {
		return filters;
	}

	public void setFilters(List<FilterRequestDTO> filters) {
		this.filters = filters;
	}

}
