package com.simtech.dao;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.PostingTag;

@Repository
public interface PostingTagRepository extends JpaRepository<PostingTag, Long> {
	List<PostingTag> findByHashTagIdAndPostingPostTypeAndPostingObjectStatusAndPostingStatus(Long tagId,
			String postType, String objectStatus, String status, Pageable pageable);

	List<PostingTag> findByHashTagIdInAndPostingObjectStatusAndPostingPostTypeInOrderByPostingCreatedDateDesc(
			List<Long> tagId, String objectStatus, List<String> postTypes, Pageable pageable);

	List<PostingTag> findByPostingId(Long id);

	List<PostingTag> findByHashTagIdAndPostingPostTypeAndPostingObjectStatusAndPostingStatus(Long tagId,
			String postType, String objectStatus, String status);

}