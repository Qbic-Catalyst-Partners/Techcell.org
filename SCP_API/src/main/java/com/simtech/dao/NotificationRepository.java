package com.simtech.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.simtech.entity.Notification;
import com.simtech.entity.UserDetail;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientUserOrderByCreatedDateDesc(UserDetail recipientUser);
    List<Notification> findByRecipientUserAndIsReadOrderByCreatedDateDesc(UserDetail recipientUser, Boolean isRead);
    List<Notification> findByRecipientUserAndClearedFalseOrderByCreatedDateDesc(UserDetail recipientUser);
    List<Notification> findByRecipientUserAndClearedFalseAndIsReadOrderByCreatedDateDesc(UserDetail recipientUser, Boolean isRead);
} 