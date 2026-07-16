package com.simtech.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import com.simtech.dto.NotificationResponseDTO;

@Service
public class WebSocketService {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketService.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendNotification(Long userId, NotificationResponseDTO notification) {
        String destination = "/topic/notifications/" + userId;
        logger.info("Sending notification to destination: {}, notification: {}", destination, notification);
        try {
            messagingTemplate.convertAndSend(destination, notification);
            logger.info("Notification sent successfully");
        } catch (Exception e) {
            logger.error("Error sending notification: {}", e.getMessage(), e);
        }
    }
} 