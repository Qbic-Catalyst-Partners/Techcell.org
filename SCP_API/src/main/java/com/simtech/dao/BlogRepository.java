package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.Blog;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {

}