package com.simtech.dto;

import java.util.Date;
import java.util.List;

public class PostSoftwareRequestDTO {

	private String softwareName;
	private String softwarelink;
	private byte[] thumbnail;
	private String version;
	private String osSupported;
	private String licenceType;
	private Date releaseDate;
	private Long primaryTag;
	private List<Long> tags;

	public String getSoftwarelink() {
		return softwarelink;
	}

	public void setSoftwarelink(String softwarelink) {
		this.softwarelink = softwarelink;
	}

	public byte[] getThumbnail() {
		return thumbnail;
	}

	public void setThumbnail(byte[] thumbnail) {
		this.thumbnail = thumbnail;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getOsSupported() {
		return osSupported;
	}

	public void setOsSupported(String osSupported) {
		this.osSupported = osSupported;
	}

	public String getLicenceType() {
		return licenceType;
	}

	public void setLicenceType(String licenceType) {
		this.licenceType = licenceType;
	}

	public Date getReleaseDate() {
		return releaseDate;
	}

	public void setReleaseDate(Date releaseDate) {
		this.releaseDate = releaseDate;
	}

	public String getSoftwareName() {
		return softwareName;
	}

	public void setSoftwareName(String softwareName) {
		this.softwareName = softwareName;
	}

	public Long getPrimaryTag() {
		return primaryTag;
	}

	public void setPrimaryTag(Long primaryTag) {
		this.primaryTag = primaryTag;
	}

	public List<Long> getTags() {
		return tags;
	}

	public void setTags(List<Long> tags) {
		this.tags = tags;
	}

}
