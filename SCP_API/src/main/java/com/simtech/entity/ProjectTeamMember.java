package com.simtech.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(
    name = "project_team_member",
    uniqueConstraints = @UniqueConstraint(name = "uk_team_email", columnNames = {"team_id", "email"}),
    indexes = {
        @Index(name = "idx_ptm_team", columnList = "team_id"),
        @Index(name = "idx_ptm_status", columnList = "status")
    }
)
public class ProjectTeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private ProjectTeam team;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserDetail user; // nullable until invite accepted

    @Column(nullable = false)
    private String email;

    private String inviteToken;

    /** INVITED, ACCEPTED, DECLINED */
    private String status = "INVITED";

    private Boolean accepted = false;
    private Date invitedAt;
    private Date acceptedAt;
    private Date updatedAt;

    // getters setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProjectTeam getTeam() { return team; }
    public void setTeam(ProjectTeam team) { this.team = team; }

    public UserDetail getUser() { return user; }
    public void setUser(UserDetail user) { this.user = user; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getInviteToken() { return inviteToken; }
    public void setInviteToken(String inviteToken) { this.inviteToken = inviteToken; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getAccepted() { return accepted; }
    public void setAccepted(Boolean accepted) { this.accepted = accepted; }

    public Date getInvitedAt() { return invitedAt; }
    public void setInvitedAt(Date invitedAt) { this.invitedAt = invitedAt; }

    public Date getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(Date acceptedAt) { this.acceptedAt = acceptedAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
} 