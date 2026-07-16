package com.simtech.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "pstg_feed_rltnp")
public class Feed {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "feed_id")
	private Long id;

	@Column(name = "feed_desc", nullable = true)
	private String description;

	@OneToOne(optional = true, fetch = FetchType.LAZY)
	@JoinColumn(name = "community_id", nullable = true)
	@JsonIgnore
	private Community community;

	@OneToOne(optional = true, fetch = FetchType.LAZY)
	@JoinColumn(name = "cntnt_pstg_id", nullable = true)
	@JsonIgnore
	private Posting contentPosting;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Community getCommunity() {
		return community;
	}

	public void setCommunity(Community community) {
		this.community = community;
	}

	public Posting getContentPosting() {
		return contentPosting;
	}

	public void setContentPosting(Posting contentPosting) {
		this.contentPosting = contentPosting;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}