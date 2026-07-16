package com.simtech.entity;

import java.util.Date;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.ManyToMany;
import javax.persistence.JoinTable;
import javax.persistence.FetchType;
import javax.persistence.CascadeType;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "pstg_cmnt_rltnp")
public class PostingComment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "pstg_id", nullable = false)
	@JsonIgnore
	private Posting posting;

	@OneToOne
	@JoinColumn(name = "user_id", nullable = false)
	private UserDetail userDetail;

	@Lob
	private String content;

	private Date commentTime;
	private Date updateTime;
	private Long parentCommentId;
	private Long replyCount;

	private Long orgId;

	// Users mentioned inside this comment (optional)
	@ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JoinTable(
		name = "cmnt_mentions",
		joinColumns = @JoinColumn(name = "comment_id"),
		inverseJoinColumns = @JoinColumn(name = "user_id")
	)
	private Set<UserDetail> mentions = new java.util.HashSet<>();

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

	public UserDetail getUserDetail() {
		return userDetail;
	}

	public void setUserDetail(UserDetail userDetail) {
		this.userDetail = userDetail;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Date getCommentTime() {
		return commentTime;
	}

	public void setCommentTime(Date commentTime) {
		this.commentTime = commentTime;
	}

	public Long getOrgId() {
		return orgId;
	}

	public void setOrgId(Long orgId) {
		this.orgId = orgId;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public Long getParentCommentId() {
		return parentCommentId;
	}

	public void setParentCommentId(Long parentCommentId) {
		this.parentCommentId = parentCommentId;
	}

	public Long getReplyCount() {
		return replyCount;
	}

	public void setReplyCount(Long replyCount) {
		this.replyCount = replyCount;
	}

	public Set<UserDetail> getMentions() {
		return mentions;
	}

	public void setMentions(Set<UserDetail> mentions) {
		this.mentions = mentions;
	}

}