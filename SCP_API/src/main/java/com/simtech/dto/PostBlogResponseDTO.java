package com.simtech.dto;

public class PostBlogResponseDTO {

	private Long id;
	private String description;
	private String blogContent;
	private byte[] thumbnail;

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getBlogContent() {
		return blogContent;
	}

	public void setBlogContent(String blogContent) {
		this.blogContent = blogContent;
	}

	public byte[] getThumbnail() {
		return thumbnail;
	}

	public void setThumbnail(byte[] thumbnail) {
		this.thumbnail = thumbnail;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public PostBlogResponseDTO(Long id, String description, String blogContent, byte[] thumbnail) {
		super();
		this.id = id;
		this.description = description;
		this.blogContent = blogContent;
		this.thumbnail = thumbnail;
	}

}
