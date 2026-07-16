package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.simtech.entity.UserDocument;

@Repository
public interface UserDocumentRepository extends JpaRepository<UserDocument, Long> {

	UserDocument findByUserIdAndDocumentType(Long UserId, String docType);

}