package com.simtech.entity;

import java.util.Date;
import java.util.List;
import javax.persistence.*;

@Entity
@Table(
    name = "project_team",
    indexes = {
        @Index(name = "idx_project_team_project", columnList = "project_id"),
        @Index(name = "idx_project_team_status", columnList = "status")
    }
)
public class ProjectTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "leader_id", nullable = false)
    private UserDetail leader;

    /** PENDING -> waiting for all invites, COMPLETE -> submitted to admin, APPROVED / REJECTED */
    private String status;

    private Date createdAt;
    private Date updatedAt;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectTeamMember> members;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public UserDetail getLeader() { return leader; }
    public void setLeader(UserDetail leader) { this.leader = leader; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public List<ProjectTeamMember> getMembers() { return members; }
    public void setMembers(List<ProjectTeamMember> members) { this.members = members; }
} 