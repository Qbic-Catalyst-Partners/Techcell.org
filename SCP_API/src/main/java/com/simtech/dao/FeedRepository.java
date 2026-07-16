package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.Feed;

@Repository
public interface FeedRepository extends JpaRepository<Feed, Long> {

}