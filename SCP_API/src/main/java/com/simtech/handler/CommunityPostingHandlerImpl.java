package com.simtech.handler;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.simtech.dao.CommunityRepository;
import com.simtech.dao.CommunityUserRepository;
import com.simtech.dao.UserfavouriteTagRepository;
import com.simtech.dao.UserRepository;
import com.simtech.dao.PostingRepository;
import com.simtech.dto.PostBaseRequestDTO;
import com.simtech.dto.PostCommunityRequestDTO;
import com.simtech.entity.Community;
import com.simtech.entity.CommunityUser;
import com.simtech.entity.HashTag;
import com.simtech.entity.Notification;
import com.simtech.entity.Posting;
import com.simtech.entity.PostingTag;
import com.simtech.entity.UserDetail;
import com.simtech.entity.UserfavouriteTag;
import com.simtech.exception.BusinessException;
import com.simtech.service.WebSocketService;

@Service
public class CommunityPostingHandlerImpl<T extends PostBaseRequestDTO> implements PostingHandler<T> {

	private static final Logger logger = LoggerFactory.getLogger(CommunityPostingHandlerImpl.class);

	/**
	 * Holds a per-thread success message so that the service layer can retrieve
	 * it after the post has been processed and pass it back to the caller.
	 */
	private static final ThreadLocal<String> infoMessageHolder = new ThreadLocal<>();

	public static String getAndClearMessage() {
		String msg = infoMessageHolder.get();
		infoMessageHolder.remove();
		return msg;
	}

	@Autowired
	private CommunityRepository communityRepository;

	@Autowired
	private CommunityUserRepository communityUserRepository;

	@Autowired
	private UserfavouriteTagRepository userfavouriteTagRepository;

	@Autowired
	private WebSocketService webSocketService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PostingRepository postingRepository;

	@Override
	public void validate(Posting posting, T post) {
		// Duplicate-moderator validation removed – we now allow creation and will
		// transfer the moderator automatically if they already moderate another
		// community.
	}

	@Override
	public void beforeProcess(Posting posting, T post) {
		logger.info("Starting community creation process");
		try {
			PostCommunityRequestDTO communityRequestDTO = (PostCommunityRequestDTO) post;
			logger.info("Creating new community with title: {}", communityRequestDTO.getTitle());
			
			// Process tags first if they exist
			if (communityRequestDTO.getTags() != null || communityRequestDTO.getPrimaryTag() != null) {
				logger.info("Processing tags for community");
				List<PostingTag> postingTags = new ArrayList<>();
				
				// Add primary tag first if exists
				if (communityRequestDTO.getPrimaryTag() != null) {
					logger.info("Adding primary tag: {}", communityRequestDTO.getPrimaryTag());
					PostingTag primaryTag = new PostingTag();
					HashTag hashTag = new HashTag(communityRequestDTO.getPrimaryTag());
					primaryTag.setHashTag(hashTag);
					primaryTag.setPosting(posting);
					primaryTag.setIsPrimary(true);
					postingTags.add(primaryTag);
					logger.info("Primary tag added with ID: {}", hashTag.getId());
				}
				
				// Add regular tags
				if (communityRequestDTO.getTags() != null && !communityRequestDTO.getTags().isEmpty()) {
					logger.info("Adding {} regular tags", communityRequestDTO.getTags().size());
					postingTags.addAll(communityRequestDTO.getTags().stream()
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
			
			Community community = new Community();
			community.setDescription(communityRequestDTO.getDescription());
			community.setProfilePhoto(communityRequestDTO.getProfilePhoto());
			community.setCoverPhoto(communityRequestDTO.getCoverPhoto());
			community.setMemberCount(Long.valueOf(1));
			community.setTitle(communityRequestDTO.getTitle());
			
			logger.info("Saving community to database");
			community = communityRepository.save(community);
			logger.info("Community saved successfully with ID: {}", community.getId());

			if (communityRequestDTO.getModerator() != null) {
				Long modId = communityRequestDTO.getModerator();
				logger.info("Assigning moderator (id={})", modId);

				// 1.  Remove the user as moderator from ANY existing community
				CommunityUser existingLink = communityUserRepository
						.findByUserDetailUserIdAndIsModerator(modId, true);

				StringBuilder removalMsg = new StringBuilder();
				UserDetail moderatorUser = userRepository.findById(modId).orElse(null);

				if (existingLink != null) {
					Community oldCommunity = existingLink.getCommunity();
					logger.info("User already moderates community {} – detaching", oldCommunity.getTitle());

					// delete old link
					communityUserRepository.delete(existingLink);

					// clear moderator reference in the old community posting
					Posting oldPosting = postingRepository.findByCommunityId(oldCommunity.getId());
					if (oldPosting != null) {
						oldPosting.setModerator(null);
						postingRepository.save(oldPosting);
					}

					if (moderatorUser != null) {
						removalMsg.append(moderatorUser.getFirstName()).append(" ")
								  .append(moderatorUser.getLastName())
								  .append(" has been removed from ")
								  .append(oldCommunity.getTitle());
					}
				}

				// 2.  Create new moderator link for the newly created community
				CommunityUser communityUser = new CommunityUser();
				communityUser.setCommunity(community);
				communityUser.setUserDetail(new UserDetail(modId));
				communityUser.setIsModerator(true);
				communityUserRepository.save(communityUser);

				posting.setModerator(communityUser.getUserDetail());

				// 3.  Build final success message
				StringBuilder finalMsg = new StringBuilder("Community uploaded successfully!");
				if (removalMsg.length() > 0) {
					finalMsg.append(" ").append(removalMsg)
							.append(" and assigned as the moderator for the new community.");
				}

				infoMessageHolder.set(finalMsg.toString());
			}

			posting.setCommunity(community);
			logger.info("Community creation process completed successfully");
		} catch (Exception e) {
			logger.error("Error during community creation: {}", e.getMessage(), e);
			throw e;
		}
	}

	@Override
	public void afterProcess(Posting posting, T post) {
		// Notification logic removed as part of refactor
	}

	private HashTag findMostRelevantTag(List<UserfavouriteTag> userFavorites, List<PostingTag> communityTags) {
		// First try to find if user has favorited the primary tag
		Optional<PostingTag> primaryTag = communityTags.stream()
			.filter(tag -> tag.getIsPrimary() != null && tag.getIsPrimary())
			.findFirst();

		if (primaryTag.isPresent()) {
			HashTag primaryHashtag = primaryTag.get().getHashTag();
			boolean hasFavoritedPrimary = userFavorites.stream()
				.anyMatch(fav -> fav.getHashTag().getId().equals(primaryHashtag.getId()));

			if (hasFavoritedPrimary) {
				logger.info("User has favorited primary tag: {}", primaryHashtag.getText());
				return primaryHashtag;
			}
		}

		// If primary tag not favorited, return the first favorited tag
		HashTag firstFavoritedTag = userFavorites.stream()
			.map(UserfavouriteTag::getHashTag)
			.findFirst()
			.orElseThrow(() -> new BusinessException("No favorited tags found"));

		logger.info("Using first favorited tag: {}", firstFavoritedTag.getText());
		return firstFavoritedTag;
	}
}
