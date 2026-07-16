package com.simtech.dao;

import com.simtech.entity.PostView;
import com.simtech.entity.PostViewId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostViewRepository extends JpaRepository<PostView, PostViewId> {
    boolean existsByPostIdAndUserId(Long postId, Long userId);
} 