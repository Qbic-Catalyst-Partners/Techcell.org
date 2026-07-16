package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.Video;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {

}