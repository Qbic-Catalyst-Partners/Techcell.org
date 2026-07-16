package com.simtech.controller;

import com.simtech.dao.ProjectTeamMemberRepository;
import com.simtech.entity.ProjectTeamMember;
import com.simtech.entity.UserDetail;
import com.simtech.dao.ProjectTeamRepository;
import com.simtech.dao.UserRepository;
import com.simtech.service.NotificationService;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import com.simtech.constants.ApplicationConstants;
import java.time.Duration;
import com.simtech.service.EmailService;
import com.simtech.util.EncryptDecryptUtil;
import com.simtech.dao.CareerRepository;
import com.simtech.dao.CareerUserRepository;

@RestController
@RequestMapping("/api/project-team")
@CrossOrigin(maxAge = 3600, origins = { "*" }, methods = { RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.POST })
public class ProjectTeamController {

    private static final Logger logger = LoggerFactory.getLogger(ProjectTeamController.class);

    @Autowired
    private ProjectTeamMemberRepository memberRepository;

    @javax.persistence.PersistenceContext
    private javax.persistence.EntityManager entityManager;

    @Autowired
    private ProjectTeamRepository projectTeamRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private EncryptDecryptUtil encryptDecryptUtil;

    @Autowired
    private CareerRepository careerRepository;

    @Autowired
    private CareerUserRepository careerUserRepository;

    @PostMapping("/invites/{token}/accept")
    @ApiOperation("Accept a project team invitation using invite token")
    @Transactional
    public String acceptInvite(HttpServletRequest request, @PathVariable("token") String token) {
        Long userId = Long.valueOf(request.getAttribute("userId").toString());
        ProjectTeamMember member = memberRepository.findByInviteToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid invitation token"));

        // Expiry check
        if (member.getInvitedAt() != null) {
            long ageMs = System.currentTimeMillis() - member.getInvitedAt().getTime();
            long maxMs = Duration.ofDays(ApplicationConstants.INVITE_TOKEN_EXPIRY_DAYS).toMillis();
            if (ageMs > maxMs) {
                return "EXPIRED";
            }
        }

        // Attach existing user reference instead of creating a new transient instance
        UserDetail ref = entityManager.getReference(UserDetail.class, userId);
        member.setUser(ref);
        member.setStatus("ACCEPTED");
        member.setAccepted(true);
        member.setAcceptedAt(new Date());
        member.setUpdatedAt(new Date());
        memberRepository.saveAndFlush(member);
        logger.info("Invitation accepted for token {} by user {}", token, userId);

        // Ensure CareerUser record exists for this member so project shows as applied
        try {
            com.simtech.entity.ProjectTeam team = member.getTeam();
            if (team != null && team.getProject() != null) {
                Long projectId = team.getProject().getId();
                // Check if already exists
                com.simtech.entity.CareerUser existing = careerUserRepository.findByUserDetailUserIdAndCareerProjectId(userId, projectId);
                if (existing == null) {
                    com.simtech.entity.Career careerEntity = careerRepository.findByProjectId(projectId);
                    if (careerEntity != null) {
                        com.simtech.entity.CareerUser cu = new com.simtech.entity.CareerUser();
                        cu.setCareer(careerEntity);
                        cu.setUserDetail(ref);
                        cu.setStatus("Applied");
                        careerUserRepository.save(cu);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error creating CareerUser on invite accept", e);
        }

        // If all members accepted, mark team complete and notify admins
        com.simtech.entity.ProjectTeam team = member.getTeam();
        boolean allAccepted = team.getMembers().stream()
                .allMatch(m -> "ACCEPTED".equalsIgnoreCase(m.getStatus()));
        if (allAccepted) {
            team.setStatus("COMPLETE");
            projectTeamRepository.save(team);

            UserDetail leader = team.getLeader();
            String leaderName = (leader.getFirstName() + " " + leader.getLastName()).trim();
            String extraJson = String.format("{\"actorUserName\":\"%s\",\"projectTitle\":\"%s\"}",
                    leaderName.replace("\"", "\\\""),
                    team.getProject().getTitle().replace("\"", "\\\""));

            java.util.List<UserDetail> admins = userRepository.findByRole("Admin");
            for (UserDetail admin : admins) {
                notificationService.createNotification(admin.getUserId(), leader.getUserId(),
                        "PROJECT_TEAM_COMPLETE", "PROJECT", team.getProject().getId(), null, extraJson);
            }

            // Notify the team leader themselves
            // Build extraJson with project title and company logo as actorPhoto
            String logoPart = "";
            try {
                byte[] logoBytes = team.getProject().getCompanyLogo();
                if (logoBytes != null && logoBytes.length > 0) {
                    String logoB64 = java.util.Base64.getEncoder().encodeToString(logoBytes);
                    logoPart = String.format(",\"actorPhoto\":\"%s\"", logoB64);
                }
            } catch (Exception ignore) {}

            String leaderExtra = String.format("{\"projectTitle\":\"%s\"%s}",
                    team.getProject().getTitle().replace("\"", "\\\""), logoPart);

            notificationService.createNotification(leader.getUserId(), null,
                    "PROJECT_TEAM_MEMBERS_ACCEPTED", "PROJECT", team.getProject().getId(), null,
                    leaderExtra);

            // Send confirmation e-mail to team leader now that the application is complete
            try {
                String projectTitle = team.getProject().getTitle();

                String subject = "Project Application Submitted - " + projectTitle;
                String bodyText = String.format("Application submitted successfully. Your application for project %s has been sent to the organisation. Kindly wait for the response from the team.", projectTitle);

                String leaderEmail;
                try {
                    leaderEmail = encryptDecryptUtil.decrypt(leader.getEmailId());
                } catch (Exception e) {
                    leaderEmail = leader.getEmailId();
                }

                emailService.sendHtmlEmail(leaderEmail, subject, "<p>" + bodyText + "</p>", false);
            } catch (Exception e) {
                logger.error("Error sending project application confirmation email", e);
            }
        }

        return "ACCEPTED";
    }

    @PostMapping("/invites/{token}/reject")
    @ApiOperation("Reject a project team invitation using invite token")
    @Transactional
    public String rejectInvite(HttpServletRequest request, @PathVariable("token") String token) {
        Long userId = Long.valueOf(request.getAttribute("userId").toString());
        ProjectTeamMember member = memberRepository.findByInviteToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid invitation token"));

        // Expiry check
        if (member.getInvitedAt() != null) {
            long ageMs = System.currentTimeMillis() - member.getInvitedAt().getTime();
            long maxMs = Duration.ofDays(ApplicationConstants.INVITE_TOKEN_EXPIRY_DAYS).toMillis();
            if (ageMs > maxMs) {
                return "EXPIRED";
            }
        }

        // Attach existing user reference instead of creating a new transient instance
        UserDetail ref = entityManager.getReference(UserDetail.class, userId);
        member.setUser(ref);
        member.setStatus("DECLINED");
        member.setAccepted(false);
        member.setUpdatedAt(new Date());
        memberRepository.saveAndFlush(member);
        logger.info("Invitation declined for token {} by user {}", token, userId);

        // Send notification to project team leader about decline
        try {
            com.simtech.entity.ProjectTeam team = member.getTeam();
            if (team != null && team.getLeader() != null) {
                com.simtech.entity.UserDetail leader = team.getLeader();

                // Build actor user name (the member who declined)
                com.simtech.entity.UserDetail actorUser = userRepository.findById(userId).orElse(null);
                String actorName = actorUser != null ? (actorUser.getFirstName() + " " + actorUser.getLastName()) : "Member";

                // Prepare extraJson with actor name and project title
                String projectTitleEsc = team.getProject() != null ? team.getProject().getTitle().replace("\"", "\\\"") : "Project";
                String extraJson = String.format("{\"actorUserName\":\"%s\",\"postingTitle\":\"%s\"}",
                        actorName.replace("\"", "\\\""), projectTitleEsc);

                notificationService.createNotification(
                        leader.getUserId(),
                        userId,
                        "PROJECT_INVITE_DECLINED",
                        "PROJECT",
                        team.getProject() != null ? team.getProject().getId() : null,
                        null,
                        extraJson);
            }
        } catch (Exception e) {
            logger.error("Error sending decline notification", e);
        }

        return "DECLINED";
    }

    @GetMapping("/invites/{token}/status")
    @ApiOperation("Get current status of a project team invitation token")
    public String getInviteStatus(@PathVariable("token") String token) {
        return memberRepository.findByInviteToken(token)
                .map(ProjectTeamMember::getStatus)
                .orElse("UNKNOWN");
    }
} 