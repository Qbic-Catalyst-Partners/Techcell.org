package com.simtech.controller;

import com.simtech.dto.NotificationResponseDTO;
import com.simtech.service.NotificationService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(maxAge = 3600, origins = { "*" }, methods = { RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.POST })
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/user/notifications")
    @ApiOperation("Get current user's notifications")
    public List<NotificationResponseDTO> getMyNotifications(HttpServletRequest request) {
        Long userId = Long.valueOf(request.getAttribute("userId").toString());
        return notificationService.getNotifications(userId);
    }

    @PutMapping("/user/notifications/{id}/read")
    @ApiOperation("Mark notification as read")
    public void markNotificationAsRead(HttpServletRequest request, @PathVariable("id") Long id) {
        Long userId = Long.valueOf(request.getAttribute("userId").toString());
        notificationService.markNotificationAsRead(userId, id);
    }

    @PutMapping("/user/notifications/{id}/unread")
    @ApiOperation("Mark notification as unread")
    public void markNotificationAsUnread(HttpServletRequest request, @PathVariable("id") Long id) {
        Long userId = Long.valueOf(request.getAttribute("userId").toString());
        notificationService.markNotificationAsUnread(userId, id);
    }

    @DeleteMapping("/user/notifications/{id}/clear")
    @ApiOperation("Clear (soft-delete) a notification")
    public void clearNotification(HttpServletRequest request, @PathVariable("id") Long id) {
        Long userId = Long.valueOf(request.getAttribute("userId").toString());
        notificationService.clearNotification(userId, id);
    }

    @DeleteMapping("/user/notifications/clear-all")
    @ApiOperation("Clear all notifications for current user")
    public void clearAllNotifications(HttpServletRequest request) {
        Long userId = Long.valueOf(request.getAttribute("userId").toString());
        notificationService.clearAllNotifications(userId);
    }

    @GetMapping("/user/notifications/unread-count")
    @ApiOperation("Get unread notifications count for current user")
    public com.simtech.response.StandardResponse<Long> getUnreadCount(HttpServletRequest request) {
        Long userId = Long.valueOf(request.getAttribute("userId").toString());
        com.simtech.response.StandardResponse<Long> response = new com.simtech.response.StandardResponse<>();
        response.setResponseOK();
        response.setData(notificationService.getUnreadCount(userId));
        return response;
    }
} 