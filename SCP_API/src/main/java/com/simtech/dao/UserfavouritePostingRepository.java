package com.simtech.dao;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.Posting;
import com.simtech.entity.UserfavouritePosting;

@Repository
public interface UserfavouritePostingRepository extends JpaRepository<UserfavouritePosting, Long> {
	List<UserfavouritePosting> findByUserIdAndPostingPostTypeAndPostingStatusOrderByEffectiveDateDesc(Long userId,
			String postType, String status, Pageable pageable);

	List<UserfavouritePosting> findByUserIdOrderByEffectiveDateDesc(Long userId);

	List<UserfavouritePosting> findByPostingInAndUserId(List<Posting> posting, Long userId);

	UserfavouritePosting findByPostingIdAndUserId(Long postingId, Long userId);

	// Count total favourites for a posting (isFavourite = true)
	@org.springframework.data.jpa.repository.Query("SELECT COUNT(u) FROM UserfavouritePosting u WHERE u.posting.id = :postingId AND u.isFavourite = true")
	Long countByPostingIdAndIsFavouriteTrue(@org.springframework.data.repository.query.Param("postingId") Long postingId);
}