package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.Community;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {

}