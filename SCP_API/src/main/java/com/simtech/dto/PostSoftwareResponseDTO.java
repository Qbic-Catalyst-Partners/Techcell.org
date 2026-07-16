package com.simtech.dto;

import java.util.Date;
import java.util.List;

public class PostSoftwareResponseDTO {

	private Long id;
	private String softwareName;
	private String softwarelink;
	private byte[] thumbnail;
	private String version;
	private String osSupported;
	private String licenceType;
	private Date releaseDate;
	private List<HashTagResponseDTO> hashTagResponseDTOs;
	private Date createdDate;
	private Date updateddDate;
	private String status;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSoftwareName() {
		return softwareName;
	}

	public void setSoftwareName(String softwareName) {
		this.softwareName = softwareName;
	}

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

	public List<HashTagResponseDTO> getHashTagResponseDTOs() {
		return hashTagResponseDTOs;
	}

	public void setHashTagResponseDTOs(List<HashTagResponseDTO> hashTagResponseDTOs) {
		this.hashTagResponseDTOs = hashTagResponseDTOs;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getUpdateddDate() {
		return updateddDate;
	}

	public void setUpdateddDate(Date updateddDate) {
		this.updateddDate = updateddDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
