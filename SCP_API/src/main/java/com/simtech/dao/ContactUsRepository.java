package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.ContactUs;

@Repository
public interface ContactUsRepository extends JpaRepository<ContactUs, Long> {

}