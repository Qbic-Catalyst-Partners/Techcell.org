package com.simtech.dto;

public class UsedAccessDTO {
	private String page;
	private String accessType;
	private boolean hasAccess;

	public String getPage() {
		return page;
	}

	public void setPage(String page) {
		this.page = page;
	}

	public String getAccessType() {
		return accessType;
	}

	public void setAccessType(String accessType) {
		this.accessType = accessType;
	}

	public boolean isHasAccess() {
		return hasAccess;
	}

	public void setHasAccess(boolean hasAccess) {
		this.hasAccess = hasAccess;
	}

	public UsedAccessDTO(String page, String accessType, boolean hasAccess) {
		super();
		this.page = page;
		this.accessType = accessType;
		this.hasAccess = hasAccess;
	}

}
