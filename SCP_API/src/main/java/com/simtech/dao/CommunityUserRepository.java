package com.simtech.dao;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.CommunityUser;

@Repository
public interface CommunityUserRepository extends JpaRepository<CommunityUser, Long> {
	CommunityUser findByUserDetailUserIdAndIsModerator(Long UserId, Boolean isModerator);

	List<CommunityUser> findByUserDetailUserId(Long UserId);

	List<CommunityUser> findByUserDetailUserId(Long UserId, Pageable pageable);

	List<CommunityUser> findByUserDetailUserIdOrderByCreatedDateDesc(Long UserId, Pageable pageable);

	CommunityUser findByUserDetailUserIdAndCommunityId(Long UserId, Long communityId);

	List<CommunityUser> findByCommunityId(Long communityId);

	List<CommunityUser> findByCommunityIdAndIsModerator(Long communityId, Boolean isModerator);

	long countByUserDetailUserId(Long userId);

}