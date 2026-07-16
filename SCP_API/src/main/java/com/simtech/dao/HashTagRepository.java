package com.simtech.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.HashTag;

@Repository
public interface HashTagRepository extends JpaRepository<HashTag, Long> {

	List<HashTag> findByTextContaining(String hasgTag);

}