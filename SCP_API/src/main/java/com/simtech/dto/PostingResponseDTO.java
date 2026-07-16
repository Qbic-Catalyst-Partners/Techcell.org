package com.simtech.dto;

import java.util.Date;
import java.util.List;

public class PostingResponseDTO {
	private Long postingId;
	private String title;
	private String shortDescription;

	private String postType;
	private Long likes;
	private Long views;
	private Long comments;
	private Long favouriteCount;

	private List<HashTagResponseDTO> postingTags;
	private UserDetailShortResponseDTO postedUser;

	private boolean liked;
	private boolean favoured;
	private Date createdDate;
	private Date updateddDate;

	private PostVideoResponseDTO video;
	private PostBlogResponseDTO blog;
	private PostCommunityResponseDTO community;
	private UserDetailShortResponseDTO moderator;
	private PostFeedResponseDTO feed;
	private String status;

	public Long getPostingId() {
		return postingId;
	}

	public void setPostingId(Long postingId) {
		this.postingId = postingId;
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

	public Long getFavouriteCount() {
		return favouriteCount;
	}

	public void setFavouriteCount(Long favouriteCount) {
		this.favouriteCount = favouriteCount;
	}

	public void setComments(Long comments) {
		this.comments = comments;
	}

	public List<HashTagResponseDTO> getPostingTags() {
		return postingTags;
	}

	public void setPostingTags(List<HashTagResponseDTO> postingTags) {
		this.postingTags = postingTags;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public PostVideoResponseDTO getVideo() {
		return video;
	}

	public void setVideo(PostVideoResponseDTO video) {
		this.video = video;
	}

	public UserDetailShortResponseDTO getPostedUser() {
		return postedUser;
	}

	public void setPostedUser(UserDetailShortResponseDTO postedUser) {
		this.postedUser = postedUser;
	}

	public boolean isLiked() {
		return liked;
	}

	public void setLiked(boolean liked) {
		this.liked = liked;
	}

	public boolean isFavoured() {
		return favoured;
	}

	public void setFavoured(boolean favoured) {
		this.favoured = favoured;
	}

	public PostBlogResponseDTO getBlog() {
		return blog;
	}

	public void setBlog(PostBlogResponseDTO blog) {
		this.blog = blog;
	}

	public Date getUpdateddDate() {
		return updateddDate;
	}

	public void setUpdateddDate(Date updateddDate) {
		this.updateddDate = updateddDate;
	}

	public UserDetailShortResponseDTO getModerator() {
		return moderator;
	}

	public void setModerator(UserDetailShortResponseDTO moderator) {
		this.moderator = moderator;
	}

	public PostCommunityResponseDTO getCommunity() {
		return community;
	}

	public void setCommunity(PostCommunityResponseDTO community) {
		this.community = community;
	}

	public PostFeedResponseDTO getFeed() {
		return feed;
	}

	public void setFeed(PostFeedResponseDTO feed) {
		this.feed = feed;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
