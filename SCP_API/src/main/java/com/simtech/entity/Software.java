package com.simtech.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Software {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String softwareName;
	private String softwarelink;
	@Lob
	private byte[] thumbnail;
	private String version;
	private String osSupported;
	private String licenceType;
	private Date releaseDate;
	@OneToOne
	@JoinColumn(name = "user_id", nullable = true)
	@JsonIgnore
	private UserDetail userDetail;

	private Date createdDate;
	private Date updateddDate;
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "software")
//	@JsonIgnore
	private List<SoftwareTag> softwareTags;
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

	public UserDetail getUserDetail() {
		return userDetail;
	}

	public void setUserDetail(UserDetail userDetail) {
		this.userDetail = userDetail;
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

	public List<SoftwareTag> getSoftwareTags() {
		return softwareTags;
	}

	public void setSoftwareTags(List<SoftwareTag> softwareTags) {
		this.softwareTags = softwareTags;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}