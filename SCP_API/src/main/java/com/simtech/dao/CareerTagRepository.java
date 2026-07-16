package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.CareerTag;

@Repository
public interface CareerTagRepository extends JpaRepository<CareerTag, Long> {

}