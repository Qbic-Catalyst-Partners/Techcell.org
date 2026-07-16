package com.simtech.service;

import com.simtech.entity.Notification;

public interface NotificationService {

    Notification createNotification(Long recipientUserId,
                                    Long actorUserId,
                                    String eventType,
                                    String entityType,
                                    Long entityId,
                                    String message,
                                    String extraJson);

    java.util.List<com.simtech.dto.NotificationResponseDTO> getNotifications(Long userId);

    void markNotificationAsRead(Long userId, Long notificationId);

    void createNotificationsForTags(Long actorUserId,
                                    java.util.List<Long> tagIds,
                                    String eventType,
                                    String entityType,
                                    Long entityId,
                                    String extraJson);

    Long getUnreadCount(Long userId);

    void markNotificationAsUnread(Long userId, Long notificationId);

    void clearNotification(Long userId, Long notificationId);

    void clearAllNotifications(Long userId);
} 