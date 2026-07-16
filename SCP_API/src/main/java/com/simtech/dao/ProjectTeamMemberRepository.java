package com.simtech.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.simtech.entity.ProjectTeamMember;
import java.util.Optional;

public interface ProjectTeamMemberRepository extends JpaRepository<ProjectTeamMember, Long> {
    Optional<ProjectTeamMember> findByInviteToken(String inviteToken);
} 