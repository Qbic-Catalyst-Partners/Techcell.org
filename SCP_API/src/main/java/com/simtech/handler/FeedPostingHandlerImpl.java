package com.simtech.handler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.simtech.dao.FeedRepository;
import com.simtech.dto.PostBaseRequestDTO;
import com.simtech.dto.PostFeedRequestDTO;
import com.simtech.entity.Community;
import com.simtech.entity.Feed;
import com.simtech.entity.Posting;

@Service
public class FeedPostingHandlerImpl<T extends PostBaseRequestDTO> implements PostingHandler<T> {

	@Autowired
	FeedRepository feedRepository;

	@Override
	public void validate(Posting posting, T post) {
		// TODO Auto-generated method stub

	}

	public FeedPostingHandlerImpl(FeedRepository feedRepository) {
		this.feedRepository = feedRepository;
	}

	@Override
	public void beforeProcess(Posting posting, T post) {
		PostFeedRequestDTO postVideoRequestDTO = (PostFeedRequestDTO) post;
		Feed feed = new Feed();
		if (postVideoRequestDTO.getContentPostingId() != null) {
			feed.setContentPosting(new Posting(postVideoRequestDTO.getContentPostingId()));
		}
		feed.setCommunity(new Community(postVideoRequestDTO.getCommunityId()));
		feed.setDescription(postVideoRequestDTO.getDescription());
		feedRepository.save(feed);
		posting.setFeed(feed);
	}

	@Override
	public void afterProcess(Posting posting, T post) {
		// TODO Auto-generated method stub

	}
}
