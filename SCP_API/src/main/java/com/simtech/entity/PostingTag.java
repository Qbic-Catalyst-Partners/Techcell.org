package com.simtech.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "pstg_tag_rltnp")
public class PostingTag {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "pstg_id", nullable = false)
	@JsonIgnore
	private Posting posting;

	@OneToOne
	@JoinColumn(name = "tag_id", nullable = false)
	@JsonIgnore
	private HashTag hashTag;

	private Boolean isPrimary;

	private Long orgId;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Posting getPosting() {
		return posting;
	}

	public void setPosting(Posting posting) {
		this.posting = posting;
	}

	public HashTag getHashTag() {
		return hashTag;
	}

	public void setHashTag(HashTag hashTag) {
		this.hashTag = hashTag;
	}

	public Long getOrgId() {
		return orgId;
	}

	public void setOrgId(Long orgId) {
		this.orgId = orgId;
	}

	public Boolean getIsPrimary() {
		return isPrimary;
	}

	public void setIsPrimary(Boolean isPrimary) {
		this.isPrimary = isPrimary;
	}

}