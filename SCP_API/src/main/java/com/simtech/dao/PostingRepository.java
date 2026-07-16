
package com.simtech.dao;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.simtech.entity.Posting;

@Repository
public interface PostingRepository extends JpaRepository<Posting, Long>, JpaSpecificationExecutor<Posting> {
	List<Posting> findByObjectStatusAndPostTypeInAndStatusOrderByCreatedDateDesc(String objectStatus,
			List<String> postTypes, String status, Pageable pageable);

			List<Posting> findByObjectStatusAndPostTypeAndStatusOrderByCreatedDateDesc(
    String objectStatus, String postType, String status, Pageable pageable);

	List<Posting> findByObjectStatusAndPostTypeAndStatus(String objectStatus, String postType,
			String status, Pageable pageable);

	List<Posting> findByObjectStatusAndPostedUserUserIdAndPostTypeAndStatusOrderByCreatedDateDesc(String objectStatus,
			Long userId, String postType, String status, Pageable pageable);

	List<Posting> findByObjectStatusAndPostedUserUserIdOrderByCreatedDateDesc(String code, Long userId,
			Pageable pageable);

	List<Posting> findByFeedCommunityIdOrderByUpdateddDateDesc(Long communityId, Pageable pageable);

	Posting findByCommunityId(Long communityId);

	List<Posting> findDistinctIdByPostingTagsHashTagIdInAndObjectStatusAndPostTypeInAndStatusOrderByCreatedDateDesc(
			List<Long> tagId, String objectStatus, List<String> postTypes, String status, Pageable pageable);

	long countByPostType(String postType);

	long countByPostedUserUserIdAndStatusAndPostTypeIn(Long userId, String status, List<String> postTypes);

}
