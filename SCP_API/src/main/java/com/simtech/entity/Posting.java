package com.simtech.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "PSTG")
public class Posting {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String title;
	@Column(name = "short_desc")
	private String shortDescription;

	private String postType;
	private Long likes;
	private Long views;
	private Long comments;
	private String objectStatus;

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "posting")
//	@JsonIgnore
	private List<PostingTag> postingTags;

	@OneToOne(optional = true, fetch = FetchType.LAZY)
	@JoinColumn(name = "video_id", nullable = true)
	@JsonIgnore
	private Video video;

	@OneToOne(optional = true, fetch = FetchType.LAZY)
	@JoinColumn(name = "blog_id", nullable = true)
	@JsonIgnore
	private Blog blog;

	@OneToOne(optional = true, fetch = FetchType.LAZY)
	@JoinColumn(name = "community_id", nullable = true)
	@JsonIgnore
	private Community community;

	@OneToOne(optional = true, fetch = FetchType.LAZY)
	@JoinColumn(name = "feed_id", nullable = true)
	@JsonIgnore
	private Feed feed;

	@OneToOne
	@JoinColumn(name = "user_id", nullable = false)
	@JsonIgnore
	private UserDetail postedUser;

	@OneToOne
	@JoinColumn(name = "moderator_id", nullable = true)
	@JsonIgnore
	private UserDetail moderator;

	private Date createdDate;
	private Date updateddDate;

	private String status;
	private String reason;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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

	public String getPostType() {
		return postType;
	}

	public void setPostType(String postType) {
		this.postType = postType;
	}

	public Long getLikes() {
		return likes;
	}

	public void setLikes(Long likes) {
		this.likes = likes;
	}

	public Long getViews() {
		return views;
	}

	public void setViews(Long views) {
		this.views = views;
	}

	public Long getComments() {
		return comments;
	}

	public void setComments(Long comments) {
		this.comments = comments;
	}

	public UserDetail getPostedUser() {
		return postedUser;
	}

	public void setPostedUser(UserDetail postedUser) {
		this.postedUser = postedUser;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Video getVideo() {
		return video;
	}

	public void setVideo(Video video) {
		this.video = video;
	}

	public List<PostingTag> getPostingTags() {
		return postingTags;
	}

	public void setPostingTags(List<PostingTag> postingTags) {
		this.postingTags = postingTags;
	}

	public String getObjectStatus() {
		return objectStatus;
	}

	public void setObjectStatus(String objectStatus) {
		this.objectStatus = objectStatus;
	}

	public Posting(Long id) {
		super();
		this.id = id;
	}

	public Posting() {
		super();
	}

	public Blog getBlog() {
		return blog;
	}

	public void setBlog(Blog blog) {
		this.blog = blog;
	}

	public Community getCommunity() {
		return community;
	}

	public void setCommunity(Community community) {
		this.community = community;
	}

	public UserDetail getModerator() {
		return moderator;
	}

	public void setModerator(UserDetail moderator) {
		this.moderator = moderator;
	}

	public Date getUpdateddDate() {
		return updateddDate;
	}

	public void setUpdateddDate(Date updateddDate) {
		this.updateddDate = updateddDate;
	}

	public Feed getFeed() {
		return feed;
	}

	public void setFeed(Feed feed) {
		this.feed = feed;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

}