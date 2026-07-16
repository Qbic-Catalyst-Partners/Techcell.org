package com.simtech.handler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simtech.dto.constant.DocumentTypeEnum;

@Component
public class PostingHandlerProvider {

	@Autowired
	private VideoPostingHandlerImpl videoPostingHandler;

	@Autowired
	private BlogPostingHandlerImpl blogPostingHandlerImpl;

	@Autowired
	private CommunityPostingHandlerImpl communityPostingHandlerImpl;

	@Autowired
	private FeedPostingHandlerImpl feedPostingHandlerImpl;

	public PostingHandler<?> getPostingHandler(DocumentTypeEnum contentType) {
		if (DocumentTypeEnum.VIDEOS == contentType) {
			return videoPostingHandler;
		}
		if (DocumentTypeEnum.BLOGS == contentType) {
			return blogPostingHandlerImpl;
		}
		if (DocumentTypeEnum.COMMUNITY == contentType) {
			return communityPostingHandlerImpl;
		}
		if (DocumentTypeEnum.FEED == contentType) {
			return feedPostingHandlerImpl;
		} else {
			throw new IllegalArgumentException("Unsupported content type: " + contentType);
		}
	}
}
