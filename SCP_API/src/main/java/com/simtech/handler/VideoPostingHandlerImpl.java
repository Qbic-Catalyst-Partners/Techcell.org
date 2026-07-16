package com.simtech.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.simtech.dao.VideoRepository;
import com.simtech.dto.PostBaseRequestDTO;
import com.simtech.dto.PostVideoRequestDTO;
import com.simtech.entity.Posting;
import com.simtech.entity.Video;
import com.simtech.entity.PostingTag;
import com.simtech.entity.HashTag;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class VideoPostingHandlerImpl<T extends PostBaseRequestDTO> implements PostingHandler<T> {
	private static final Logger logger = LoggerFactory.getLogger(VideoPostingHandlerImpl.class);

	@Autowired
	private VideoRepository videoRepository;

	@Override
	public void validate(Posting posting, T post) {
		// TODO Auto-generated method stub

	}

	public VideoPostingHandlerImpl(VideoRepository videoRepository) {
		this.videoRepository = videoRepository;
	}

	@Override
	public void beforeProcess(Posting posting, T post) {
		logger.info("Starting video creation process");
		try {
			PostVideoRequestDTO videoRequestDTO = (PostVideoRequestDTO) post;
			logger.info("Creating new video with title: {}", videoRequestDTO.getTitle());
			
			// Process tags first if they exist
			if (videoRequestDTO.getTags() != null || videoRequestDTO.getPrimaryTag() != null) {
				logger.info("Processing tags for video");
				List<PostingTag> postingTags = new ArrayList<>();
				
				// Add primary tag first if exists
				if (videoRequestDTO.getPrimaryTag() != null) {
					logger.info("Adding primary tag: {}", videoRequestDTO.getPrimaryTag());
					PostingTag primaryTag = new PostingTag();
					HashTag hashTag = new HashTag(videoRequestDTO.getPrimaryTag());
					primaryTag.setHashTag(hashTag);
					primaryTag.setPosting(posting);
					primaryTag.setIsPrimary(true);
					postingTags.add(primaryTag);
					logger.info("Primary tag added with ID: {}", hashTag.getId());
				}
				
				// Add regular tags
				if (videoRequestDTO.getTags() != null && !videoRequestDTO.getTags().isEmpty()) {
					logger.info("Adding {} regular tags", videoRequestDTO.getTags().size());
					postingTags.addAll(videoRequestDTO.getTags().stream()
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
			
			Video video = new Video();
			video.setDescription(videoRequestDTO.getDescription());
			video.setVideoLink(videoRequestDTO.getVideolink());
			video.setVideoData(videoRequestDTO.getVideocontent());
			
			logger.info("Saving video to database");
			video = videoRepository.save(video);
			logger.info("Video saved successfully with ID: {}", video.getId());
			
			posting.setVideo(video);
			logger.info("Video creation process completed successfully");
		} catch (Exception e) {
			logger.error("Error during video creation: {}", e.getMessage(), e);
			throw e;
		}
	}

	@Override
	public void afterProcess(Posting posting, T post) {
		// Notification logic removed as part of refactor
	}
}
