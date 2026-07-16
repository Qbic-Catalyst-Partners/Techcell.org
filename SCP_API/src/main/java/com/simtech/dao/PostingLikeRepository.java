package com.simtech.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.Posting;
import com.simtech.entity.PostingLike;

@Repository
public interface PostingLikeRepository extends JpaRepository<PostingLike, Long> {
	PostingLike findByPostingIdAndUserDetailUserId(Long postingId, Long userId);

	List<PostingLike> findByPostingInAndUserDetailUserId(List<Posting> posting, Long userId);
}