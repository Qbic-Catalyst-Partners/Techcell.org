package com.simtech.dao;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.PostingComment;

@Repository
public interface PostingCommentRepository extends JpaRepository<PostingComment, Long> {
	List<PostingComment> findByPostingIdAndParentCommentIdIsNullOrderByCommentTimeDesc(Long pstgId, Pageable pageable);

	List<PostingComment> findByparentCommentIdOrderByCommentTimeDesc(Long parentCommentId, Pageable pageable);

}