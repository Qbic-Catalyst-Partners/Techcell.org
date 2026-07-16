package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.Stream;

@Repository
public interface StreamRepository extends JpaRepository<Stream, Long> {
	Stream findBysreamCode(String sreamCode);

}