package com.simtech.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "pstg_community_rltnp")
public class Community {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "community_id")
	private Long id;

	private String title;
	@Column(name = "community_desc")
	private String description;
	@Lob
	private byte[] profilePhoto;
	@Lob
	private byte[] coverPhoto;

	private Long memberCount;

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "community")
	@JsonIgnore
	private List<CommunityUser> communityUsers;

	private Date createdDate;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public byte[] getProfilePhoto() {
		return profilePhoto;
	}

	public void setProfilePhoto(byte[] profilePhoto) {
		this.profilePhoto = profilePhoto;
	}

	public byte[] getCoverPhoto() {
		return coverPhoto;
	}

	public void setCoverPhoto(byte[] coverPhoto) {
		this.coverPhoto = coverPhoto;
	}

	public Long getMemberCount() {
		return memberCount;
	}

	public void setMemberCount(Long memberCount) {
		this.memberCount = memberCount;
	}

	public List<CommunityUser> getCommunityUsers() {
		return communityUsers;
	}

	public void setCommunityUsers(List<CommunityUser> communityUsers) {
		this.communityUsers = communityUsers;
	}

	public Community(Long id) {
		super();
		this.id = id;
	}

	public Community() {
		super();
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

}