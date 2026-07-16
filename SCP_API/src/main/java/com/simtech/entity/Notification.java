package com.simtech.entity;

import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Column;
import com.simtech.entity.UserDetail;

@Entity
@Table(name = "notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserDetail recipientUser;

    @ManyToOne
    @JoinColumn(name = "action_user_id")
    private UserDetail actorUser; // Nullable – system events

    /** Example values: NEW_BLOGS, BLOG_COMMENT, SOFTWARE_NEW ... */
    private String eventType;

    /** BLOG, VIDEO, COMMUNITY, SOFTWARE, CAREER, PROJECT, etc. */
    private String entityType;

    /** Primary key of the entity instance (blog/video id, etc.). Re-uses legacy column posting_id */
    @Column(name = "posting_id")
    private Long entityId;

    /** Optional descriptive message */
    private String message;

    /** JSON blob for additional dynamic data */
    @Column(columnDefinition = "TEXT")
    private String extraJson;

    private Boolean isRead;
    /** Soft-delete flag. When true, notification is hidden for the user but kept in DB */
    private Boolean cleared = false;
    private Date createdDate;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserDetail getRecipientUser() {
        return recipientUser;
    }

    public void setRecipientUser(UserDetail recipientUser) {
        this.recipientUser = recipientUser;
    }

    public UserDetail getActorUser() {
        return actorUser;
    }

    public void setActorUser(UserDetail actorUser) {
        this.actorUser = actorUser;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getExtraJson() {
        return extraJson;
    }

    public void setExtraJson(String extraJson) {
        this.extraJson = extraJson;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Boolean getCleared() {
        return cleared;
    }

    public void setCleared(Boolean cleared) {
        this.cleared = cleared;
    }
} 