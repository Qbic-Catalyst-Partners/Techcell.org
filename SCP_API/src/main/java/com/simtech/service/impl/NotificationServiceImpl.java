package com.simtech.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.simtech.dao.NotificationRepository;
import com.simtech.dao.UserRepository;
import com.simtech.dao.UserfavouriteTagRepository;
import com.simtech.dao.ProjectRepository;
import com.simtech.entity.Notification;
import com.simtech.entity.UserDetail;
import com.simtech.service.NotificationService;
import com.simtech.service.WebSocketService;
import com.simtech.dto.NotificationResponseDTO;

import java.util.Date;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserfavouriteTagRepository userfavouriteTagRepository;

    @Autowired
    private WebSocketService webSocketService;

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    @Transactional
    public Notification createNotification(Long recipientUserId,
                                           Long actorUserId,
                                           String eventType,
                                           String entityType,
                                           Long entityId,
                                           String message,
                                           String extraJson) {

        UserDetail recipient = userRepository.findById(recipientUserId).orElse(null);
        if (recipient == null) {
            throw new IllegalArgumentException("Recipient user does not exist: " + recipientUserId);
        }

        UserDetail actor = null;
        if (actorUserId != null) {
            actor = userRepository.findById(actorUserId).orElse(null);
        }

        Notification n = new Notification();
        n.setRecipientUser(recipient);
        n.setActorUser(actor);
        n.setEventType(eventType);
        n.setEntityType(entityType);
        n.setEntityId(entityId);
        n.setMessage(message);
        n.setExtraJson(extraJson);
        n.setIsRead(false);
        n.setCleared(false);
        n.setCreatedDate(new Date());

        n = notificationRepository.save(n);

        // Build DTO for websocket push
        NotificationResponseDTO dto = new NotificationResponseDTO();
        dto.setId(n.getId());
        dto.setEventType(n.getEventType());
        dto.setEntityType(n.getEntityType());
        dto.setEntityId(n.getEntityId());
        dto.setMessage(n.getMessage());
        dto.setIsRead(n.getIsRead());
        dto.setCreatedDate(n.getCreatedDate());
        // Append actor photo to extraJson
        String finalJson = extraJson;
        try {
            byte[] photoBytes = actor != null ? actor.getProfilePhoto() : null;
            if (photoBytes != null) {
                String photoBase64 = java.util.Base64.getEncoder().encodeToString(photoBytes);
                if (finalJson == null || finalJson.isEmpty()) {
                    finalJson = String.format("{\"actorPhoto\":\"%s\"}", photoBase64);
                } else if (finalJson.trim().endsWith("}")) {
                    finalJson = finalJson.trim().substring(0, finalJson.trim().length() - 1) +
                            String.format(",\"actorPhoto\":\"%s\"}", photoBase64);
                }
            }
        } catch (Exception ignore) {}

        dto.setExtraJson(finalJson);

        // If project team events & actorPhoto missing – embed companyLogo
        if ("PROJECT_TEAM_MEMBERS_ACCEPTED".equals(n.getEventType())
                && (dto.getExtraJson() == null || !dto.getExtraJson().contains("actorPhoto"))) {
            try {
                if (n.getEntityId() != null) {
                    com.simtech.entity.Project p = projectRepository.findById(n.getEntityId()).orElse(null);
                    if (p != null && p.getCompanyLogo() != null) {
                        String logoB64 = java.util.Base64.getEncoder().encodeToString(p.getCompanyLogo());
                        String extra = dto.getExtraJson();
                        if (extra == null || extra.isEmpty()) {
                            extra = String.format("{\"actorPhoto\":\"%s\"}", logoB64);
                        } else if (extra.trim().endsWith("}")) {
                            extra = extra.trim().substring(0, extra.trim().length() - 1) +
                                    String.format(",\"actorPhoto\":\"%s\"}", logoB64);
                        }
                        dto.setExtraJson(extra);
                    }
                }
            } catch (Exception ignore) {}
        }

        // Send to recipient
        webSocketService.sendNotification(recipientUserId, dto);

        return n;
    }

    @Override
    public java.util.List<NotificationResponseDTO> getNotifications(Long userId) {
        UserDetail user = userRepository.findById(userId).orElse(null);
        if (user == null) return java.util.Collections.emptyList();

        java.util.List<com.simtech.entity.Notification> list =
                notificationRepository.findByRecipientUserAndClearedFalseOrderByCreatedDateDesc(user);

        java.util.List<NotificationResponseDTO> dtos = new java.util.ArrayList<>();
        for (com.simtech.entity.Notification n : list) {
            NotificationResponseDTO dto = new NotificationResponseDTO();
            dto.setId(n.getId());
            dto.setEventType(n.getEventType());
            dto.setEntityType(n.getEntityType());
            dto.setEntityId(n.getEntityId());
            dto.setMessage(n.getMessage());
            dto.setIsRead(n.getIsRead());
            dto.setCreatedDate(n.getCreatedDate());
            dto.setExtraJson(n.getExtraJson());
            // ensure actor photo present
            try {
                if (n.getActorUser() != null && n.getActorUser().getProfilePhoto() != null) {
                    String photoB64 = java.util.Base64.getEncoder().encodeToString(n.getActorUser().getProfilePhoto());
                    String extra = dto.getExtraJson();
                    if (extra == null || extra.isEmpty()) {
                        extra = String.format("{\"actorPhoto\":\"%s\"}", photoB64);
                    } else if (extra.trim().endsWith("}")) {
                        extra = extra.trim().substring(0, extra.trim().length() - 1) +
                                String.format(",\"actorPhoto\":\"%s\"}", photoB64);
                    }
                    dto.setExtraJson(extra);
                }
            } catch (Exception ignore) {}

            // For project-team events ensure company logo present
            if ("PROJECT_TEAM_MEMBERS_ACCEPTED".equals(n.getEventType())
                    && (dto.getExtraJson() == null || !dto.getExtraJson().contains("actorPhoto"))) {
                try {
                    if (n.getEntityId() != null) {
                        com.simtech.entity.Project p = projectRepository.findById(n.getEntityId()).orElse(null);
                        if (p != null && p.getCompanyLogo() != null) {
                            String logoB64 = java.util.Base64.getEncoder().encodeToString(p.getCompanyLogo());
                            String extra = dto.getExtraJson();
                            if (extra == null || extra.isEmpty()) {
                                extra = String.format("{\"actorPhoto\":\"%s\"}", logoB64);
                            } else if (extra.trim().endsWith("}")) {
                                extra = extra.trim().substring(0, extra.trim().length() - 1) +
                                        String.format(",\"actorPhoto\":\"%s\"}", logoB64);
                            }
                            dto.setExtraJson(extra);
                        }
                    }
                } catch (Exception ignore) {}
            }

            // Fallback: if message null, derive for project-team approval/rejection
            if (dto.getMessage() == null && ("PROJECT_TEAM_APPROVED".equals(n.getEventType()) || "PROJECT_TEAM_REJECTED".equals(n.getEventType()))) {
                String actorName = n.getActorUser() != null ? (n.getActorUser().getFirstName() + " " + n.getActorUser().getLastName()) : "Admin";
                String projectTitle = "Project";
                try {
                    if (dto.getExtraJson() != null && dto.getExtraJson().contains("projectTitle")) {
                        com.fasterxml.jackson.databind.JsonNode node = new com.fasterxml.jackson.databind.ObjectMapper().readTree(dto.getExtraJson());
                        if (node.has("projectTitle")) projectTitle = node.get("projectTitle").asText();
                    }
                } catch (Exception ignore) {}

                if ("PROJECT_TEAM_APPROVED".equals(n.getEventType())) {
                    dto.setMessage(String.format("%s accepted your team application for project %s", actorName, projectTitle));
                } else {
                    dto.setMessage(String.format("%s rejected your team application for project %s", actorName, projectTitle));
                }
            }

            dtos.add(dto);
        }
        return dtos;
    }

    @Override
    @Transactional
    public void markNotificationAsRead(Long userId, Long notificationId) {
        com.simtech.entity.Notification n = notificationRepository.findById(notificationId).orElse(null);
        if (n == null) {
            throw new IllegalArgumentException("Notification not found: " + notificationId);
        }
        // Verify recipient matches current user
        if (n.getRecipientUser() == null || !n.getRecipientUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Notification does not belong to user");
        }

        if (Boolean.TRUE.equals(n.getIsRead())) {
            return; // already read
        }

        n.setIsRead(true);
        notificationRepository.save(n);
    }

    @Override
    @Transactional
    public void markNotificationAsUnread(Long userId, Long notificationId) {
        com.simtech.entity.Notification n = notificationRepository.findById(notificationId).orElse(null);
        if (n == null) {
            throw new IllegalArgumentException("Notification not found: " + notificationId);
        }
        // Verify recipient matches current user
        if (n.getRecipientUser() == null || !n.getRecipientUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Notification does not belong to user");
        }

        if (Boolean.FALSE.equals(n.getIsRead())) {
            return; // already unread
        }

        n.setIsRead(false);
        notificationRepository.save(n);
    }

    @Override
    @Transactional
    public void createNotificationsForTags(Long actorUserId,
                                           java.util.List<Long> tagIds,
                                           String eventType,
                                           String entityType,
                                           Long entityId,
                                           String extraJson) {

        if (tagIds == null || tagIds.isEmpty()) return;

        java.util.List<com.simtech.entity.UserfavouriteTag> favs = userfavouriteTagRepository.findByHashTagIdIn(tagIds);

        java.util.Set<Long> recipientIds = new java.util.HashSet<>();
        for (com.simtech.entity.UserfavouriteTag f : favs) {
            if (f.getUserId() != null && !f.getUserId().equals(actorUserId)) {
                recipientIds.add(f.getUserId());
            }
        }

        if (recipientIds.isEmpty()) return;

        for (Long recipientId : recipientIds) {
            createNotification(recipientId, actorUserId, eventType, entityType, entityId, null, extraJson);
        }
    }

    @Override
    public Long getUnreadCount(Long userId) {
        UserDetail user = userRepository.findById(userId).orElse(null);
        if (user == null) return 0L;
        return (long) notificationRepository.findByRecipientUserAndClearedFalseAndIsReadOrderByCreatedDateDesc(user, false).size();
    }

    @Override
    @Transactional
    public void clearNotification(Long userId, Long notificationId) {
        com.simtech.entity.Notification n = notificationRepository.findById(notificationId).orElse(null);
        if (n == null) {
            throw new IllegalArgumentException("Notification not found: " + notificationId);
        }
        if (n.getRecipientUser() == null || !n.getRecipientUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Notification does not belong to user");
        }
        if (Boolean.TRUE.equals(n.getCleared())) {
            return;
        }
        n.setCleared(true);
        notificationRepository.save(n);
    }

    @Override
    @Transactional
    public void clearAllNotifications(Long userId) {
        UserDetail user = userRepository.findById(userId).orElse(null);
        if (user == null) return;
        java.util.List<com.simtech.entity.Notification> list = notificationRepository.findByRecipientUserAndClearedFalseOrderByCreatedDateDesc(user);
        if (list.isEmpty()) return;
        for (com.simtech.entity.Notification n : list) {
            n.setCleared(true);
        }
        notificationRepository.saveAll(list);
    }
} 