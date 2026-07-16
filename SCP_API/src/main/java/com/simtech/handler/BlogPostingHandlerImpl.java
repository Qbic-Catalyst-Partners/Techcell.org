package com.simtech.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.simtech.dao.BlogRepository;
import com.simtech.dto.PostBaseRequestDTO;
import com.simtech.dto.PostBlogRequestDTO;
import com.simtech.entity.Blog;
import com.simtech.entity.Posting;
import com.simtech.entity.PostingTag;
import com.simtech.entity.HashTag;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogPostingHandlerImpl<T extends PostBaseRequestDTO> implements PostingHandler<T> {
	private static final Logger logger = LoggerFactory.getLogger(BlogPostingHandlerImpl.class);

	@Autowired
	private BlogRepository blogRepository;

	@Override
	public void validate(Posting posting, T post) {
		// TODO Auto-generated method stub

	}

	public BlogPostingHandlerImpl(BlogRepository blogRepository) {
		this.blogRepository = blogRepository;
	}

	@Override
	public void beforeProcess(Posting posting, T post) {
		logger.info("Starting blog creation process");
		try {
			PostBlogRequestDTO blogRequestDTO = (PostBlogRequestDTO) post;
			logger.info("Creating new blog with title: {}", blogRequestDTO.getTitle());
			
			// Process tags first if they exist
			if (blogRequestDTO.getTags() != null || blogRequestDTO.getPrimaryTag() != null) {
				logger.info("Processing tags for blog");
				List<PostingTag> postingTags = new ArrayList<>();
				
				// Add primary tag first if exists
				if (blogRequestDTO.getPrimaryTag() != null) {
					logger.info("Adding primary tag: {}", blogRequestDTO.getPrimaryTag());
					PostingTag primaryTag = new PostingTag();
					HashTag hashTag = new HashTag(blogRequestDTO.getPrimaryTag());
					primaryTag.setHashTag(hashTag);
					primaryTag.setPosting(posting);
					primaryTag.setIsPrimary(true);
					postingTags.add(primaryTag);
					logger.info("Primary tag added with ID: {}", hashTag.getId());
				}
				
				// Add regular tags
				if (blogRequestDTO.getTags() != null && !blogRequestDTO.getTags().isEmpty()) {
					logger.info("Adding {} regular tags", blogRequestDTO.getTags().size());
					postingTags.addAll(blogRequestDTO.getTags().stream()
						.map(tagId -> {
							PostingTag postingTag = new PostingTag();
							postingTag.setHashTag(new HashTag(tagId));
							postingTag.setPosting(posting);
							postingTag.setIsPrimary(false);
							return postingTag;
						})
						.collect(Collectors.toList()));
				}
				
				posting.setPostingTags(postingTags);
				logger.info("Tags processed successfully. Total tags: {}", postingTags.size());
			}
			
			Blog blog = new Blog();
			blog.setDescription(blogRequestDTO.getDescription());
			blog.setBlogContent(blogRequestDTO.getBlogContent());
			blog.setThumbnail(blogRequestDTO.getThumbnail());
			
			logger.info("Saving blog to database");
			blog = blogRepository.save(blog);
			logger.info("Blog saved successfully with ID: {}", blog.getId());
			
			posting.setBlog(blog);
			logger.info("Blog creation process completed successfully");
		} catch (Exception e) {
			logger.error("Error during blog creation: {}", e.getMessage(), e);
			throw e;
		}
	}

	@Override
	public void afterProcess(Posting posting, T post) {
		// Notification logic removed as part of refactor
	}
}
