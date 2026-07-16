package com.simtech.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.UserfavouriteTag;

@Repository
public interface UserfavouriteTagRepository extends JpaRepository<UserfavouriteTag, Long> {
	List<UserfavouriteTag> findByUserId(Long userId);

	List<UserfavouriteTag> findByUserIdAndHashTagIdIn(Long userId, List<Long> hashtagIds);
	
	List<UserfavouriteTag> findByHashTagId(Long hashtagId);

	List<UserfavouriteTag> findByHashTagIdIn(List<Long> tagIds);
}