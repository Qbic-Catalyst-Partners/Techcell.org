package com.simtech.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;
import com.simtech.constants.ApplicationConstants;
import com.simtech.dao.CareerRepository;
import com.simtech.dao.CareerUserRepository;
import com.simtech.dao.CertificationRepository;
import com.simtech.dao.CommunityRepository;
import com.simtech.dao.CommunityUserRepository;
import com.simtech.dao.ContactUsRepository;
import com.simtech.dao.InternshipRepository;
import com.simtech.dao.JobRepository;
import com.simtech.dao.OTPRepository;
import com.simtech.dao.PostingCommentRepository;
import com.simtech.dao.PostingLikeRepository;
import com.simtech.dao.PostingRepository;
import com.simtech.dao.PostingTagRepository;
import com.simtech.dao.ProjectRepository;
import com.simtech.dao.ProjectTeamRepository;
import com.simtech.dao.ProjectTeamMemberRepository;
import com.simtech.dao.ResumeRepository;
import com.simtech.dao.RoleAccessRepository;
import com.simtech.dao.SoftwareRepository;
import com.simtech.dao.SoftwareTagRepository;
import com.simtech.dao.UserAccessRepository;
import com.simtech.dao.UserDocumentRepository;
import com.simtech.dao.UserRepository;
import com.simtech.dao.UserSigninRepository;
import com.simtech.dao.UserfavouritePostingRepository;
import com.simtech.dao.UserfavouriteTagRepository;
import com.simtech.dao.PostViewRepository;
import com.simtech.dto.ApprovePostRequestDTO;
import com.simtech.dto.CareerAppliedDTO;
import com.simtech.dto.CareerApplyRequestDTO;
import com.simtech.dto.CareerApproveRequestDTO;
import com.simtech.dto.CareerResponseDTO;
import com.simtech.dto.CertificationResponseDTO;
import com.simtech.dto.CommunityModeratorRequestDTO;
import com.simtech.dto.CommunityPostingResponseDTO;
import com.simtech.dto.CommunityUserDTO;
import com.simtech.dto.CommunityUserResponseDTO;
import com.simtech.dto.ContactRequestDTO;
import com.simtech.dto.FavouriteRequestDTO;
import com.simtech.dto.FilterRequestDTO;
import com.simtech.dto.InternshipResponseDTO;
import com.simtech.dto.JobResponseDTO;
import com.simtech.dto.LikePostRequestDTO;
import com.simtech.dto.ListingRequestDTO;
import com.simtech.dto.MaintainResumeRequestDTO;
import com.simtech.dto.OTPVerificationRequestDTO;
import com.simtech.dto.PostSoftwareResponseDTO;
import com.simtech.dto.PostingCommentRequestDTO;
import com.simtech.dto.PostingCommentResponseDTO;
import com.simtech.dto.PostingResponseDTO;
import com.simtech.dto.ProjectResponseDTO;
import com.simtech.dto.ResetPasswordDTO;
import com.simtech.dto.UpdateStatusRequestDTO;
import com.simtech.dto.UsedAccessDTO;
import com.simtech.dto.UserCreateDTO;
import com.simtech.dto.UserDetailResponseDTO;
import com.simtech.dto.UserDetailShortResponseDTO;
import com.simtech.dto.UserProfileResponseDTO;
import com.simtech.dto.UserSigninRequestDTO;
import com.simtech.dto.UserSigninResponseDTO;
import com.simtech.dto.UserUpdateDTO;
import com.simtech.dto.VerifySecurityQuestionReqDTO;
import com.simtech.dto.constant.DocumentTypeEnum;
import com.simtech.dto.constant.ObjectStatus;
import com.simtech.entity.Career;
import com.simtech.entity.CareerUser;
import com.simtech.entity.Certification;
import com.simtech.entity.Community;
import com.simtech.entity.CommunityUser;
import com.simtech.entity.ContactUs;
import com.simtech.entity.HashTag;
import com.simtech.entity.Internship;
import com.simtech.entity.Job;
import com.simtech.entity.OTP;
import com.simtech.entity.Posting;
import com.simtech.entity.PostingComment;
import com.simtech.entity.PostingLike;
import com.simtech.entity.PostingTag;
import com.simtech.entity.Project;
import com.simtech.entity.ProjectTeam;
import com.simtech.entity.ProjectTeamMember;
import com.simtech.entity.Resume;
import com.simtech.entity.RoleAccessRelationship;
import com.simtech.entity.SecurityQuestion;
import com.simtech.entity.Software;
import com.simtech.entity.SoftwareTag;
import com.simtech.entity.UserAccessRelationship;
import com.simtech.entity.UserDetail;
import com.simtech.entity.UserSignin;
import com.simtech.entity.UserfavouritePosting;
import com.simtech.entity.UserfavouriteTag;
import com.simtech.entity.Notification;
import com.simtech.entity.PostView;
import com.simtech.exception.BusinessException;
import com.simtech.service.EmailService;
import com.simtech.service.EmailTemplateService;
import com.simtech.service.SMSService;
import com.simtech.service.UserService;
import com.simtech.service.helper.UserDocumentHelper;
import com.simtech.service.helper.UserServiceHelper;
import com.simtech.util.AuthTokenUtil;
import com.simtech.util.EncryptDecryptUtil;
import com.simtech.service.WebSocketService;
import com.simtech.service.NotificationService;
import com.simtech.dto.ProfilePhotoDTO;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import java.util.Base64;

@Service
public class UserServiceImpl implements UserService {
	private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
	final static List<String> homePageDocList = Collections
			.unmodifiableList(Arrays.asList("Videos", "Blogs", "Community"));
	final static List<String> community = Collections.unmodifiableList(Arrays.asList("Community"));
	private static final String DATE_FORMAT = "yyyy-MM-dd";
	private static final String OPERATOR_LIKE = "like";
	private static final String OPERATOR_EQUALS = "equals";
	private static final String OPERATOR_GREATERTHAN = "greaterThan";
	private static final String OPERATOR_LESSTHAN = "lessThan";
	final static List<String> defaultCarrerStatus = Collections
			.unmodifiableList(Arrays.asList("Applied", "Accepted", "Rejected"));

	@Autowired
	UserRepository userRepository;

	@Autowired
	UserServiceHelper userServiceHelper;

	@Autowired
	UserDocumentHelper userDocumentHelper;

	@Autowired
	UserSigninRepository userSigninRepository;

	@Autowired
	UserDocumentRepository userDocumentRepository;

	@Autowired
	EncryptDecryptUtil encryptDecryptUtil;

	@Autowired
	OTPRepository otpRepository;

	@Autowired
	PostingRepository postingRepository;

	@Autowired
	UserfavouritePostingRepository userfavouritePostingRepository;

	@Autowired
	PostingLikeRepository postingLikeRepository;

	@Autowired
	RoleAccessRepository roleAccessRepository;
	@Autowired
	UserAccessRepository userAccessRepository;
	@Autowired
	PostingTagRepository postingTagRepository;
	@Autowired
	UserfavouriteTagRepository userfavouriteTagRepository;

	@Autowired
	PostingCommentRepository postingCommentRepository;

	@Autowired
	private EmailTemplateService emailTemplateService;

	@Autowired
	CommunityUserRepository communityUserRepository;
	@Autowired
	CommunityRepository communityRepository;

	@Autowired
	SoftwareRepository softwareRepository;

	@Autowired
	SoftwareTagRepository softwareTagRepository;

	@Autowired
	InternshipRepository internshipRepository;

	@Autowired
	JobRepository jobRepository;

	@Autowired
	private EmailService emailService;

	@Autowired
	ProjectRepository projectRepository;
	@Autowired
	CareerUserRepository careerUserRepository;
	@Autowired
	CareerRepository careerRepository;
	@Autowired
	ContactUsRepository contactUsRepository;

	@Autowired
	CertificationRepository certificationRepository;

	@Autowired
	ResumeRepository resumeRepository;

	@Autowired
	SMSService smsService;

	@Autowired
	private WebSocketService webSocketService;

	@Autowired
	private NotificationService notificationService;

	@Autowired
	ProjectTeamRepository projectTeamRepository;

	@Autowired
	ProjectTeamMemberRepository projectTeamMemberRepository;

	@Autowired
	private PostViewRepository postViewRepository;

	@Override
	public UserSigninResponseDTO signIn(UserSigninRequestDTO userSignin) {
		UserSignin existingRecord = userSigninRepository.findByUserName(userSignin.getEmailId());
		validateUserSigninRequest(userSignin, existingRecord);
		handleActiveSession(existingRecord);
		return createUserSigninResponse(existingRecord);
	}

	private void validateUserSigninRequest(UserSigninRequestDTO userSignin, UserSignin existingRecord) {
		if (existingRecord == null) {
			throw new BusinessException("invalidUserName");
		}

		if (!userServiceHelper.verifyPassword(userSignin.getPassword(), existingRecord.getPassword())) {
			logger.error("Invalid Password");
			throw new BusinessException("invalidPassword");
		}

		if (!"Active".equals(existingRecord.getUserDetail().getStatus())) {
			throw new BusinessException("InactiveUser");
		}
	}

	private void handleActiveSession(UserSignin existingRecord) {
		if (existingRecord.getToken() != null) {
			try {
				Claims claims = AuthTokenUtil.parseToken(existingRecord.getToken());
				Long extTimeInt = (Long) claims.get("expirationDate");
				Date expiryDate = new Date(extTimeInt);
				if (expiryDate.after(new Date())) {
					Date date2 = new Date(System.currentTimeMillis() - 1200000);
					if (existingRecord.getLastSignInDate().compareTo(date2) > 0) {
						throw new BusinessException("ActiveSession");
					}

				}
			} catch (ExpiredJwtException e) {
				// Token expired, continue with sign in
			}
		}
	}

	private UserSigninResponseDTO createUserSigninResponse(UserSignin existingRecord) {
		UserSigninResponseDTO userSigninResponseDTO = new UserSigninResponseDTO();
		userSigninResponseDTO.setUserDetailResponseDTO(
				userServiceHelper.generateUserDetailResponseDTO(existingRecord.getUserDetail()));

		String generatedToken = userServiceHelper.generateToken(existingRecord);
		userSigninResponseDTO.setToken(generatedToken);
		userSigninResponseDTO.setRefreshToken(userServiceHelper.generateRefreshToken(existingRecord));

		if (existingRecord.getUserDetail().getOrgDetail() != null) {
			userSigninResponseDTO.setOrgName(existingRecord.getUserDetail().getOrgDetail().getOrgName());
		}
		userSigninResponseDTO.setLastSignInDate(existingRecord.getLastSignInDate());

		existingRecord.setToken(generatedToken);
		existingRecord.setLastSignInDate(new Date());
		userSigninRepository.save(existingRecord);

		return userSigninResponseDTO;
	}

	@Override
	public void logOut(HttpServletRequest request) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		UserSignin existingRecord = userSigninRepository.findByUserDetailUserId(userId);
		existingRecord.setToken(null);
		userSigninRepository.save(existingRecord);
	}

	@Override
	public void validateSession(Long userId) {
		UserSignin existingRecord = userSigninRepository.findByUserDetailUserId(userId);
		Date date2 = new Date(System.currentTimeMillis() - 1200000);
		if (existingRecord.getLastSignInDate().compareTo(date2) < 0) {
			throw new BusinessException("TokenExpired");
		} else {
			existingRecord.setLastSignInDate(new Date());
			userSigninRepository.save(existingRecord);
		}
	}

	@Override
	@Transactional
	public void addUser(List<UserCreateDTO> userCreateDTOs) {
		for (UserCreateDTO userCreateDTO : userCreateDTOs) {
			UserSignin existingRecord = userSigninRepository.findByUserName(userCreateDTO.getEmailId());

			if (existingRecord != null) {
				// Check if OTP is verified
				if (existingRecord.getUserDetail().isOtpVerified()) {
					// If OTP is verified, throw duplicate email error
					throw new BusinessException("Duplicateemail", userCreateDTO.getEmailId());
				} else {
					// If OTP is not verified, delete existing records
					Long userId = existingRecord.getUserDetail().getUserId();

					// Delete OTP records first (foreign key constraint)
					otpRepository.deleteByUserDetailUserId(userId);

					// Delete UserSignin record
					userSigninRepository.delete(existingRecord);

					// Delete UserDetail record
					userRepository.deleteById(userId);

					// Now proceed with creating a new account
					logger.info("Deleted unverified user account for email: {}", userCreateDTO.getEmailId());
				}
			}

			// Create new user account (either no existing account or unverified account was deleted)
			UserDetail userDetail = userServiceHelper.generateUserObjForCreate(userCreateDTO);
			// Store external invite token if provided
			if (userCreateDTO.getInviteToken() != null && !userCreateDTO.getInviteToken().trim().isEmpty()) {
				userDetail.setPendingInviteToken(userCreateDTO.getInviteToken().trim());
			}
			userRepository.save(userDetail);

			UserSignin userSignins = userServiceHelper.generateUserSignIn(userDetail, userCreateDTO);
			userSigninRepository.save(userSignins);

			OTP emailOtp = userServiceHelper.sendRegisterEmailOTP(userDetail, userCreateDTO.getEmailId());
			otpRepository.save(emailOtp);

			userServiceHelper.sendSMSOTP(userDetail);
		}
	}

	@Override
	@Transactional
	public void updateUser(HttpServletRequest request, UserUpdateDTO userUpdateDTO) {
		Long userId = userUpdateDTO.getUserId() != null ? userUpdateDTO.getUserId()
				: Long.valueOf(request.getAttribute("userId").toString());
		UserDetail userDetail = userRepository.findById(userId).get();
		userDetail = userServiceHelper.generateUserObjForUpdate(userDetail, userUpdateDTO);
		userRepository.save(userDetail);
		if (userUpdateDTO.getEmailId() != null) {
			UserSignin userSignins = userSigninRepository.findByUserDetailUserId(userId);
			userSignins.setUserName(userUpdateDTO.getEmailId());
			userSigninRepository.save(userSignins);
		}

	}

	@Override
	@Transactional
	public void generateSigninOTP(String emailId) {
		UserSignin existingRecord = userSigninRepository.findByUserName(emailId);
		if (existingRecord == null) {
			throw new BusinessException("invalidUserName");
		}
		String otp = userServiceHelper.generateOTP();
		OTP otpObj = userServiceHelper.generateOTPObj(existingRecord.getUserDetail(), emailId, otp, "Signin");
		otpRepository.deleteByUserDetailUserId(existingRecord.getUserDetail().getUserId());
		otpRepository.save(otpObj);
		userServiceHelper.sendEmailForOTP(emailId, existingRecord.getUserDetail().getFirstName(), otp);

	}

	@Override
	public UserSigninResponseDTO signInUsingOTP(UserSigninRequestDTO userSignin) {
		UserSignin existingRecord = userSigninRepository.findByUserName(userSignin.getEmailId());
		if (existingRecord == null) {
			throw new BusinessException("invalidUserName");
		}
		OTP otpObj = otpRepository.findByUserDetailUserIdAndOtpCodeAndExpiryTimeAfter(
				existingRecord.getUserDetail().getUserId(), userSignin.getPassword(), new Date());
		if (otpObj == null || otpObj.getIsVerified()) {
			throw new BusinessException("invalidOTP");
		}
		otpObj.setIsVerified(true);
		otpRepository.save(otpObj);
		handleActiveSession(existingRecord);
		UserSigninResponseDTO userSigninResponseDTO = new UserSigninResponseDTO();
		userSigninResponseDTO.setUserDetailResponseDTO(
				userServiceHelper.generateUserDetailResponseDTO(existingRecord.getUserDetail()));

		// Generate token and refresh token
		String token = userServiceHelper.generateToken(existingRecord);
		String refreshToken = userServiceHelper.generateRefreshToken(existingRecord);
		
		// Update response
		userSigninResponseDTO.setToken(token);
		userSigninResponseDTO.setRefreshToken(refreshToken);
		
		// Update database record with token and last sign in date
		existingRecord.setToken(token);
		existingRecord.setLastSignInDate(new Date());
		userSigninRepository.save(existingRecord);
		
		// Add organization name if available
		if (existingRecord.getUserDetail().getOrgDetail() != null) {
			userSigninResponseDTO.setOrgName(existingRecord.getUserDetail().getOrgDetail().getOrgName());
		}
		userSigninResponseDTO.setLastSignInDate(existingRecord.getLastSignInDate());
		
		return userSigninResponseDTO;
	}

	@Override
	public UserSigninResponseDTO verifyOTP(OTPVerificationRequestDTO userSignin) {
		UserSignin existingRecord = userSigninRepository.findByUserName(userSignin.getEmailId());
		if (existingRecord == null) {
			throw new BusinessException("invalidUserName");
		}
		if (userSignin.getEmailOTP() != null) {
			OTP emailOtp = otpRepository
					.findFirstByUserDetailUserIdAndOtpCodeAndSourceAndExpiryTimeAfterOrderByCreatedTimeDesc(
							existingRecord.getUserDetail().getUserId(), userSignin.getEmailOTP(), "Email", new Date());
			if (emailOtp == null || emailOtp.getIsVerified()) {
				throw new BusinessException("invalidOTP");
			}
			emailOtp.setIsVerified(true);
			otpRepository.save(emailOtp);
		}
		if (userSignin.getMobileOTP() != null) {
			String mobileNo = encryptDecryptUtil.decrypt(existingRecord.getUserDetail().getMobileNo());

			String smsverify = smsService.verifyOtp("+91" + mobileNo, userSignin.getMobileOTP());
			if (!"Otp Verified".equals(smsverify)) {
				throw new BusinessException("invalidSMSOTP");
			}
		}
		UserDetail userDetail = existingRecord.getUserDetail();
		userDetail.setOtpVerified(true);
		userRepository.save(userDetail);

		// Replace existing welcome email block in verifyOTP with call to helper and attach token logic
		// Remove old welcome email if-block and insert new code:
		userServiceHelper.sendWelcomeEmail(userDetail);

		// Handle pending invite token attachment
		if (userDetail.getPendingInviteToken() != null && !userDetail.getPendingInviteToken().isEmpty()) {
			try {
				java.util.Optional<ProjectTeamMember> optMember = projectTeamMemberRepository.findByInviteToken(userDetail.getPendingInviteToken());
				if (optMember.isPresent()) {
					ProjectTeamMember member = optMember.get();
					member.setUser(userDetail);
					// Keep status as is (INVITED) so admin can approve; update joined time
					member.setUpdatedAt(new java.util.Date());
					projectTeamMemberRepository.save(member);

					// Send PROJECT_INVITE notification now that user exists
					ProjectTeam team = member.getTeam();
					if (team != null) {
						UserDetail leader = team.getLeader();
						String leaderName = leader != null ? (leader.getFirstName() + " " + leader.getLastName()) : "Team Lead";
						String extraJsonInv = String.format("{\"actorUserName\":\"%s\",\"projectTitle\":\"%s\",\"inviteToken\":\"%s\"}",
								leaderName.replace("\\\"", "'"),
								team.getProject()!=null ? team.getProject().getTitle().replace("\\\"", "'") : "Project",
								member.getInviteToken());
						notificationService.createNotification(
								userDetail.getUserId(),
								leader != null ? leader.getUserId() : null,
								"PROJECT_INVITE",
								"PROJECT",
								team.getProject()!=null ? team.getProject().getId() : null,
								null,
								extraJsonInv);
					}
				}
			} catch (Exception e) {
				logger.error("Error linking user with project team via invite token", e);
			}
			// Clear the token so it's not processed again
			userDetail.setPendingInviteToken(null);
			userRepository.save(userDetail);
}

		UserSigninResponseDTO userSigninResponseDTO = new UserSigninResponseDTO();
		userSigninResponseDTO.setUserDetailResponseDTO(userServiceHelper.generateUserDetailResponseDTO(userDetail));
		return userSigninResponseDTO;
	}

	@Override
	public SecurityQuestion getSecurityQuestion(String emailId) {
		UserSignin existingRecord = userSigninRepository.findByUserName(emailId);
		if (existingRecord == null) {
			throw new BusinessException("invalidUserName");
		}
		return existingRecord.getUserDetail().getSecurityQuestion();
	}

	@Override
	public Boolean verifySecurityQuestion(VerifySecurityQuestionReqDTO securityQuestionReqDTO) {
		UserSignin existingRecord = userSigninRepository.findByUserName(securityQuestionReqDTO.getEmailId());
		if (existingRecord == null) {
			throw new BusinessException("invalidUserName");
		}
		if (existingRecord.getUserDetail().getSecurityAns().equalsIgnoreCase(securityQuestionReqDTO.getAns())) {
			return true;
		} else {
			throw new BusinessException("incorectAns");
		}

	}

	@Override
	public void resetPassword(ResetPasswordDTO resetPasswordDTO) {
		UserSignin existingRecord = userSigninRepository.findByUserName(resetPasswordDTO.getEmailId());
		if (existingRecord == null) {
			throw new BusinessException("invalidUserName");
		}
		existingRecord.setPassword(encryptDecryptUtil.encrypt(resetPasswordDTO.getPassword()));
		userSigninRepository.save(existingRecord);
	}

	@Override
	public List<PostingResponseDTO> getPostingList(DocumentTypeEnum documentTypeEnum, HttpServletRequest request,
												   int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		Long userId = Long.valueOf(request.getAttribute("userId").toString());

		List<Posting> postings = null;
		if (documentTypeEnum != null) {
			PageRequest pageRequest = PageRequest.of(page, size, Sort.Direction.DESC, "CreatedDate");
			postings = postingRepository.findByObjectStatusAndPostTypeAndStatus(ObjectStatus.APPROVED.getCode(),
					documentTypeEnum.getCode(), "Active", pageRequest);
		} else {
			postings = postingRepository.findByObjectStatusAndPostTypeInAndStatusOrderByCreatedDateDesc(
					ObjectStatus.APPROVED.getCode(), homePageDocList, "Active", pageable);
		}
		// DEBUG: log out the IDs we fetched to trace duplicates
		if (logger.isDebugEnabled()) {
			logger.debug("getPostingList fetched IDs: {}", postings.stream().map(Posting::getId).collect(Collectors.toList()));
		}

		List<PostingResponseDTO> result = userServiceHelper.generatePostingResponseDTOs(postings);
		if (logger.isDebugEnabled()) {
			logger.debug("getPostingList returning {} DTOs", result.size());
		}
		List<PostingLike> likes = postingLikeRepository.findByPostingInAndUserDetailUserId(postings, userId);
		communityUserRepository.findByUserDetailUserIdAndIsModerator(userId, null);

		List<UserfavouritePosting> userFavouritePosting = userfavouritePostingRepository
				.findByPostingInAndUserId(postings, userId);
		List<CommunityUser> communityUsers = communityUserRepository.findByUserDetailUserId(userId);
		userServiceHelper.setLikeFavouriteInPostingResponseDTO(result, likes, userFavouritePosting, communityUsers);
		return result;
	}

	@Override
	@Transactional
	public void addToFavourite(HttpServletRequest request, FavouriteRequestDTO favoriteRequestDTO) {
		Long orgId = Long.valueOf(request.getAttribute("orgId").toString());
		Long userId = Long.valueOf(request.getAttribute("userId").toString());

		UserfavouritePosting userfavouritePosting = userfavouritePostingRepository
				.findByPostingIdAndUserId(favoriteRequestDTO.getPostingId(), userId);
		List<PostingTag> postingTags = null;
		if (userfavouritePosting == null) {
			userfavouritePosting = userServiceHelper.generateUserfavouritePosting(orgId, userId,
					favoriteRequestDTO.getPostingId(), favoriteRequestDTO.isFavourite());

			postingTags = postingTagRepository.findByPostingId(favoriteRequestDTO.getPostingId());
		} else {
			postingTags = userfavouritePosting.getPosting().getPostingTags();
		}
		userfavouritePosting.setFavourite(favoriteRequestDTO.isFavourite());
		userfavouritePosting = userfavouritePostingRepository.save(userfavouritePosting);
		// get existing Favourite tags for user , if posting Tags are not added as
		// favourite then add
		List<UserfavouriteTag> existingUserfavouriteTags = userfavouriteTagRepository.findByUserId(userId);
		List<Long> existingFaVTagIds = existingUserfavouriteTags.stream().map(Source -> {
			return Source.getHashTag().getId();
		}).collect(Collectors.toList());

		List<UserfavouriteTag> userfavouriteTags = new ArrayList<UserfavouriteTag>();
		for (PostingTag postingTag : postingTags) {
			if (!existingFaVTagIds.contains(postingTag.getHashTag().getId()) && favoriteRequestDTO.isFavourite()) {
				userfavouriteTags
						.add(userServiceHelper.generateUserfavouriteTag(orgId, userId, postingTag.getHashTag()));
			}
		}
		userfavouriteTagRepository.saveAll(userfavouriteTags);
	}

	@Override
	public List<PostingResponseDTO> getMyFavouritePostingList(HttpServletRequest request,
															  DocumentTypeEnum documentTypeEnum, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		List<UserfavouritePosting> userfavouritePostings = userfavouritePostingRepository
				.findByUserIdAndPostingPostTypeAndPostingStatusOrderByEffectiveDateDesc(userId,
						documentTypeEnum.getCode(), "Active", pageable);
		// Only keep records that are still marked as favourite
		userfavouritePostings = userfavouritePostings.stream()
				.filter(UserfavouritePosting::isFavourite)
				.collect(java.util.stream.Collectors.toList());
		List<PostingResponseDTO> result = userServiceHelper.generatePostingResponseDTOForFav(userfavouritePostings);
		return result;
	}

	@Override
	public List<PostingResponseDTO> getMyPostingList(HttpServletRequest request, DocumentTypeEnum documentTypeEnum,
													 Long userId, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		if (userId == null) {
			userId = Long.valueOf(request.getAttribute("userId").toString());
		}
		List<Posting> postings = new ArrayList<Posting>();
		if (documentTypeEnum != null) {
			postings = postingRepository
					.findByObjectStatusAndPostedUserUserIdAndPostTypeAndStatusOrderByCreatedDateDesc(
							ObjectStatus.APPROVED.getCode(), userId, documentTypeEnum.getCode(), "Active", pageable);
		} else {
			postings = postingRepository.findByObjectStatusAndPostedUserUserIdOrderByCreatedDateDesc(
					ObjectStatus.APPROVED.getCode(), userId, pageable);
		}
		List<PostingResponseDTO> result = userServiceHelper.generatePostingResponseDTOs(postings);
		return result;
	}

	@Override
	public List<UsedAccessDTO> getMyAccess(HttpServletRequest request) {
		String role = request.getAttribute("role").toString();
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		List<RoleAccessRelationship> roleAccessRelationships = roleAccessRepository.findByRoleType(role);
		Map<String, Boolean> roleAccessmap = roleAccessRelationships.stream()
				.collect(Collectors.toMap(obj -> obj.getPage() + ApplicationConstants.DELEMITER + obj.getAccessType(),
						RoleAccessRelationship::getIsEnable));
		List<UserAccessRelationship> userAccessRelationships = userAccessRepository.findByUserDetailUserId(userId);
		Map<String, Boolean> userAccessmap = userAccessRelationships.stream().collect(
				Collectors.toMap(obj -> obj.getPage() + obj.getAccessType(), UserAccessRelationship::getIsEnable));
		roleAccessmap.putAll(userAccessmap);
		return userServiceHelper.generateUsedAccessDTO(roleAccessmap);
	}

	@Override
	public List<PostingResponseDTO> getPostingListByTagId(HttpServletRequest request, DocumentTypeEnum documentTypeEnum,
														  Long tagId, int page, int size) {
		List<PostingTag> postingTags;
		if (size <= 0) {
			// Fetch all records without pagination when size is 0 or negative
			postingTags = postingTagRepository
				.findByHashTagIdAndPostingPostTypeAndPostingObjectStatusAndPostingStatus(tagId,
						documentTypeEnum.getCode(), ObjectStatus.APPROVED.getCode(), "Active");
		} else {
			Pageable pageable = PageRequest.of(page, size);
			postingTags = postingTagRepository
				.findByHashTagIdAndPostingPostTypeAndPostingObjectStatusAndPostingStatus(tagId,
						documentTypeEnum.getCode(), ObjectStatus.APPROVED.getCode(), "Active", pageable);
		}
		List<Posting> postings = postingTags.stream()
				.map(PostingTag::getPosting)
				.distinct()
				.sorted(java.util.Comparator.comparing(Posting::getCreatedDate).reversed())
				.collect(Collectors.toList());
		return userServiceHelper.generatePostingResponseDTOs(postings);
	}

	@Override
	public void likePost(HttpServletRequest request, LikePostRequestDTO likePostRequestDTO) {
		Long orgId = Long.valueOf(request.getAttribute("orgId").toString());
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		logger.info("Like request received - userId: {}, postingId: {}, isLike: {}", 
			userId, likePostRequestDTO.getPostingId(), likePostRequestDTO.isLike());

		PostingLike postingLike = postingLikeRepository
				.findByPostingIdAndUserDetailUserId(likePostRequestDTO.getPostingId(), userId);
		if (postingLike == null || postingLike.getIsLike() != likePostRequestDTO.isLike()) {
			postingLike = userServiceHelper.generatePostingLike(postingLike, orgId, userId, likePostRequestDTO);
			postingLike = postingLikeRepository.save(postingLike);
			Posting posting = postingRepository.findById(likePostRequestDTO.getPostingId()).get();
			posting.setLikes(posting.getLikes() + (likePostRequestDTO.isLike() ? 1 : -1));
			postingRepository.save(posting);

			logger.info("Post like updated - postId: {}, newLikeCount: {}, postOwnerId: {}", 
				posting.getId(), posting.getLikes(), posting.getPostedUser().getUserId());

			// Create notification for post owner when liked
			if (likePostRequestDTO.isLike() && !posting.getPostedUser().getUserId().equals(userId)) {
				UserDetail actionUser = userRepository.findById(userId).orElse(null);
				if (actionUser != null) {
					String entityType = posting.getPostType();
					String safeTitle = posting.getTitle() != null ? posting.getTitle().replaceAll("\"", "\\\"") : "";
					String extraJson = String.format("{\"postingTitle\":\"%s\",\"actorUserName\":\"%s %s\"}",
							safeTitle,
							actionUser.getFirstName(), actionUser.getLastName());

					notificationService.createNotification(
							posting.getPostedUser().getUserId(),
							userId,
							"LIKE",
							entityType,
							posting.getId(),
							null,
							extraJson);
				}
			}
		} else {
			logger.info("No changes needed - existing like status matches request");
		}
	}

	@Override
	public Set<HashTag> getMyFavouritePostingList(HttpServletRequest request) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		List<UserfavouriteTag> userfavouritePostings = userfavouriteTagRepository.findByUserId(userId);
		Set<HashTag> result = userServiceHelper.generateHashTagForFav(userfavouritePostings);
		return result;
	}

	@Override
	public void deleteFavouriteTagList(HttpServletRequest request, List<Long> tagIds) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		List<UserfavouriteTag> userfavouritePostings = userfavouriteTagRepository.findByUserIdAndHashTagIdIn(userId,
				tagIds);

		userfavouriteTagRepository.deleteInBatch(userfavouritePostings);
	}

	@Override
	public List<PostingResponseDTO> getPostingListUsingFavTag(HttpServletRequest request, List<Long> hashTagList,
															  String status, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		String role = request.getAttribute("role").toString();
		List<Posting> postings = null;
		if ("Admin".equals(role) || "Moderator".equals(role)) {
			postings = postingRepository.findByObjectStatusAndPostTypeInAndStatusOrderByCreatedDateDesc(status,
					homePageDocList, "Active", pageable);
		} else {
			if (hashTagList == null) {
				Set<HashTag> favourteHashTagList = getMyFavouritePostingList(request);
				if (favourteHashTagList != null) {
					hashTagList = favourteHashTagList.stream().map(hashTag -> {
						return hashTag.getId();
					}).collect(Collectors.toList());
				}
			}
			postings = postingRepository
					.findDistinctIdByPostingTagsHashTagIdInAndObjectStatusAndPostTypeInAndStatusOrderByCreatedDateDesc(
							hashTagList, status, homePageDocList, "Active", pageable);
		}
		// DEBUG: log out the IDs we fetched to trace duplicates
		if (logger.isDebugEnabled()) {
			logger.debug("getPostingListUsingFavTag fetched IDs: {}", postings.stream().map(Posting::getId).collect(Collectors.toList()));
		}

		List<PostingResponseDTO> result = userServiceHelper.generatePostingResponseDTOs(postings);
		if (logger.isDebugEnabled()) {
			logger.debug("getPostingListUsingFavTag returning {} DTOs", result.size());
		}
		List<PostingLike> likes = postingLikeRepository.findByPostingInAndUserDetailUserId(postings, userId);
		List<UserfavouritePosting> userFavouritePosting = userfavouritePostingRepository
				.findByPostingInAndUserId(postings, userId);
		List<CommunityUser> communityUsers = communityUserRepository.findByUserDetailUserId(userId);
		userServiceHelper.setLikeFavouriteInPostingResponseDTO(result, likes, userFavouritePosting, communityUsers);
		return result;
	}

	@Override
	public PostingResponseDTO getPosting(HttpServletRequest request, Long postingId) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		Posting postings = postingRepository.findById(postingId).get();

		PostingResponseDTO result = userServiceHelper.generatePostingResponseDTO(postings);
		PostingLike likes = postingLikeRepository.findByPostingIdAndUserDetailUserId(postingId, userId);

		UserfavouritePosting userFavouritePosting = userfavouritePostingRepository.findByPostingIdAndUserId(postingId,
				userId);
		result.setLiked(likes == null ? false : likes.getIsLike());
		result.setFavoured(userFavouritePosting == null ? false : userFavouritePosting.isFavourite());
		return result;
	}

	@Override
	public UserProfileResponseDTO getUserDetail(HttpServletRequest request, Long userId) {
		if (userId == null) {
			userId = Long.valueOf(request.getAttribute("userId").toString());
		}
		UserDetail userDetail = userRepository.findById(userId).get();

		UserProfileResponseDTO userSigninResponseDTO = new UserProfileResponseDTO();
		userSigninResponseDTO.setUserDetailResponseDTO(userServiceHelper.generateUserDetailResponseDTO(userDetail));
		userSigninResponseDTO.setOrgDetail(userDetail.getOrgDetail());
		return userSigninResponseDTO;
	}

	@Override
	@Transactional
	public void addComment(HttpServletRequest request, PostingCommentRequestDTO postingCommentRequestDTO) {
		Long orgId = Long.valueOf(request.getAttribute("orgId").toString());
		Long userId = Long.valueOf(request.getAttribute("userId").toString());

		PostingComment postingComment = userServiceHelper.generatePostingComment(orgId, userId,
				postingCommentRequestDTO.getPostingId(), postingCommentRequestDTO.getContent(),
				postingCommentRequestDTO.getParentCommentId());
		// Persist comment first (so we have ID for join table)
		postingCommentRepository.save(postingComment);

		// Fetch posting entity (needed for notifications)
		Posting posting = postingRepository.findById(postingCommentRequestDTO.getPostingId()).get();

		// Fetch actor full name for notifications
		String actorFullNameForMention;
		try {
			UserDetail actorUd = userRepository.findById(userId).orElse(null);
			actorFullNameForMention = actorUd != null ? (actorUd.getFirstName() + " " + actorUd.getLastName()).trim() : "";
		} catch (Exception e) { actorFullNameForMention = ""; }

		// Handle mentions, if provided
		java.util.List<Long> mentionIds = postingCommentRequestDTO.getMentions();
		if (mentionIds != null && !mentionIds.isEmpty()) {
			java.util.List<UserDetail> mentionedUsers = userRepository.findAllById(mentionIds);
			for (UserDetail u : mentionedUsers) {
				if (u == null) continue;
				postingComment.getMentions().add(u);
				// Notify mentioned user (avoid self)
				try {
					if (posting != null && !u.getUserId().equals(userId)) {
						String sanitizedTitle = posting.getTitle() != null ? posting.getTitle().replace("\"", "\\\"") : "";
						// Build comment content without the @Mention prefix (if present)
						String originalComment = postingComment.getContent() != null ? postingComment.getContent() : "";
						String fullName = (u.getFirstName() + " " + u.getLastName()).trim();
						String mentionRegex = "(?i)^@\\s*" + java.util.regex.Pattern.quote(fullName) + "\\s*"; // case-insensitive
						String strippedComment = originalComment.replaceFirst(mentionRegex, "").trim();

						String sanitizedComment = strippedComment.replace("\"", "\\\"");
						String sanitizedMention = fullName.replace("\"", "\\\"");

						String extraJsonMention = String.format(
								"{\"actorUserName\":\"%s\",\"postingTitle\":\"%s\",\"commentContent\":\"%s\",\"mentionUserName\":\"%s\"}",
								actorFullNameForMention.replace("\"", "\\\""),
								sanitizedTitle,
								sanitizedComment,
								sanitizedMention);
						notificationService.createNotification(
								u.getUserId(),
								userId,
								"MENTION",
								posting.getPostType(),
								posting.getId(),
								null,
								extraJsonMention);
					}
				} catch (Exception ignored) {}
			}
			postingCommentRepository.save(postingComment);
		}

		if (postingCommentRequestDTO.getParentCommentId() != null) {
			PostingComment parentComment = postingCommentRepository
					.findById(postingCommentRequestDTO.getParentCommentId()).get();
			parentComment.setReplyCount(parentComment.getReplyCount() == null ? 1 : parentComment.getReplyCount() + 1);
			postingCommentRepository.save(parentComment);
		}
		posting.setComments(posting.getComments() + 1);
		postingRepository.save(posting);

		// Create notifications for comment or reply
		try {
			UserDetail actorUser = userRepository.findById(userId).orElse(null);
			if (actorUser != null) {
				String actorFullName = actorUser.getFirstName() + " " + actorUser.getLastName();

				// Build extra JSON containing actor name, posting title and comment content
				String sanitizedTitle = posting.getTitle() != null ? posting.getTitle().replace("\"", "\\\"") : "";
				String sanitizedComment = postingComment.getContent() != null ? postingComment.getContent().replace("\"", "\\\"") : "";
				String extraJson = String.format("{\"actorUserName\":\"%s\",\"postingTitle\":\"%s\",\"commentContent\":\"%s\"}",
							actorFullName.replace("\"", "\\\""),
							sanitizedTitle,
							sanitizedComment);

				// Determine recipient and event type
				if (postingCommentRequestDTO.getParentCommentId() == null) {
					// Top-level comment – notify post owner
					Long recipientId = posting.getPostedUser() != null ? posting.getPostedUser().getUserId() : null;
					if (recipientId != null && !recipientId.equals(userId)) {
						notificationService.createNotification(recipientId, userId, "COMMENT", posting.getPostType(), posting.getId(), null, extraJson);
					}
				} else {
					// Reply to a comment – notify comment owner
					PostingComment parent = postingCommentRepository.findById(postingCommentRequestDTO.getParentCommentId()).orElse(null);
					if (parent != null && parent.getUserDetail() != null) {
						Long recipientId = parent.getUserDetail().getUserId();
						if (recipientId != null && !recipientId.equals(userId)) {
							notificationService.createNotification(recipientId, userId, "COMMENT_REPLY", posting.getPostType(), posting.getId(), null, extraJson);
						}
					}
				}
			}
		} catch (Exception e) {
			logger.error("Error while creating notification for comment", e);
		}
	}

	@Override
	public List<PostingCommentResponseDTO> getComments(Long postingId, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		List<PostingComment> postingComments = postingCommentRepository
				.findByPostingIdAndParentCommentIdIsNullOrderByCommentTimeDesc(postingId, pageable);
		List<PostingCommentResponseDTO> postingComment = userServiceHelper.PostingCommentResponse(postingComments);
		return postingComment;
	}

	@Override
	public void updateComment(HttpServletRequest request, Long commentId,
							  PostingCommentRequestDTO postingCommentRequestDTO) {
		PostingComment postingComment = postingCommentRepository.findById(commentId).get();
		postingComment.setContent(postingCommentRequestDTO.getContent());
		postingComment.setUpdateTime(new Date());
		postingCommentRepository.save(postingComment);

	}

	@Override
	public void deleteComment(Long commentId) {
		PostingComment postingComment = postingCommentRepository.findById(commentId).get();
		postingCommentRepository.delete(postingComment);
		Posting posting = postingComment.getPosting();
		posting.setComments(posting.getComments() - 1);
		postingRepository.save(posting);
	}

	@Override
	public void generateOTP(HttpServletRequest request, boolean email, boolean sms, String reason) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		UserDetail userDetail = userRepository.findById(userId).get();
		if (email) {
			String otp = userServiceHelper.generateOTP();
			OTP otpObj = userServiceHelper.generateOTPObj(userDetail,
					encryptDecryptUtil.decrypt(userDetail.getEmailId()), otp, reason);
			otpRepository.save(otpObj);
			userServiceHelper.sendEmailForOTP(encryptDecryptUtil.decrypt(userDetail.getEmailId()),
					userDetail.getFirstName(), otp);
		}
		if (sms) {
			smsService.sendotp("+91" + encryptDecryptUtil.decrypt(userDetail.getMobileNo()));
		}

	}

	@Override
	@Transactional
	public void addFavouriteTag(HttpServletRequest request, List<Long> hashTagList) {
		Long orgId = Long.valueOf(request.getAttribute("orgId").toString());
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		List<UserfavouriteTag> existingUserfavouriteTags = userfavouriteTagRepository.findByUserId(userId);
		List<Long> existingFaVTagIds = existingUserfavouriteTags.stream().map(Source -> {
			return Source.getHashTag().getId();
		}).collect(Collectors.toList());

		List<UserfavouriteTag> userfavouriteTags = new ArrayList<UserfavouriteTag>();
		for (Long hashTag : hashTagList) {
			if (!existingFaVTagIds.contains(hashTag)) {
				userfavouriteTags.add(userServiceHelper.generateUserfavouriteTag(orgId, userId, new HashTag(hashTag)));
			}
		}
		userfavouriteTagRepository.saveAll(userfavouriteTags);

	}

	@Override
	public List<UserDetailShortResponseDTO> getUserDetails(HttpServletRequest request, String role, String name) {
		List<UserDetail> userDetail = null;
		userDetail = userRepository.findAll((Specification<UserDetail>) (root, query, criteriaBuilder) -> {
			List<Predicate> predicates = new ArrayList<>();
			// Add condition for name search if provided
			if (name != null && !name.trim().isEmpty()) {
				predicates.add(criteriaBuilder.or(
					criteriaBuilder.like(root.get("firstName"), "%" + name + "%"),
					criteriaBuilder.like(root.get("lastName"), "%" + name + "%")
				));
			}
			
			// Add condition for role
			predicates.add(criteriaBuilder.equal(root.get("role"), role));

			// Add condition for status = "Active"
			predicates.add(criteriaBuilder.equal(root.get("status"), "Active"));

			return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
		});

		return userServiceHelper.generateUserDetailShortResponseDTO(userDetail);
	}

	@Override
	public List<UserDetailResponseDTO> listUserDetails(ListingRequestDTO listingRequestDTO) {
		int page = listingRequestDTO.getPage();
		int size = listingRequestDTO.getSize();
		String sortBy = listingRequestDTO.getSortBy();
		String direction = listingRequestDTO.getDirection();
		List<FilterRequestDTO> filters = listingRequestDTO.getFilters();
		Pageable pageable = PageRequest.of(page, size,
				direction.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

		List<UserDetail> users = userRepository.findAll((Specification<UserDetail>) (root, query, criteriaBuilder) -> {
			List<Predicate> predicates = new ArrayList<>();
			addFilterCondition(filters, root, criteriaBuilder, predicates);
			// Add condition for Status being "Active" or "Inactive"
			predicates.add(criteriaBuilder.or(criteriaBuilder.equal(root.get("status"), "Active"),
					criteriaBuilder.equal(root.get("status"), "Inactive")));
			return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
		}, pageable).getContent();
		List<UserDetailResponseDTO> targetList = users.stream().map(source -> {
			return userServiceHelper.generateUserDetailListResponseDTO(source);
		}).collect(Collectors.toList());
		return targetList;
	}

	@Override
	public List<CommunityPostingResponseDTO> getCommunityList(HttpServletRequest request, String orderByField,
															  String direction, int page, int size) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		String role = request.getAttribute("role").toString();
		PageRequest pageRequest = PageRequest.of(page, size,
				"asc".equals(direction) ? Sort.Direction.ASC : Sort.Direction.DESC, orderByField);
		
		List<Posting> postings;
		if ("Admin".equals(role)) {
			postings = postingRepository.findAll((Specification<Posting>) (root, query, criteriaBuilder) -> {
				query.distinct(true);
				List<Predicate> predicates = new ArrayList<>();
				predicates.add(criteriaBuilder.equal(root.get("postType"), DocumentTypeEnum.COMMUNITY.getCode()));
				predicates.add(criteriaBuilder.equal(root.get("objectStatus"), ObjectStatus.APPROVED.getCode()));
				predicates.add(criteriaBuilder.or(
						criteriaBuilder.equal(root.get("status"), "Active"),
						criteriaBuilder.equal(root.get("status"), "Inactive")));
				return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
			}, pageRequest).getContent();
		} else {
			postings = postingRepository.findByObjectStatusAndPostTypeAndStatus(
				ObjectStatus.APPROVED.getCode(), DocumentTypeEnum.COMMUNITY.getCode(), "Active", pageRequest);
		}
		
		List<CommunityUser> communityUsers = communityUserRepository.findByUserDetailUserId(userId);
		List<CommunityPostingResponseDTO> result = userServiceHelper.generateCommunityPostingResponseDTO(postings,
				communityUsers);
		return result;
	}

	@Override
	public List<CommunityPostingResponseDTO> getSuggestedCommunityList(HttpServletRequest request, int page, int size) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		List<Long> hashTagList = null;
		Set<HashTag> favourteHashTagList = getMyFavouritePostingList(request);
		if (favourteHashTagList != null) {
			hashTagList = favourteHashTagList.stream().map(hashTag -> {
				return hashTag.getId();
			}).collect(Collectors.toList());
		}
		Pageable pageable = PageRequest.of(page, size);

		List<PostingTag> postingTags = postingTagRepository
				.findByHashTagIdInAndPostingObjectStatusAndPostingPostTypeInOrderByPostingCreatedDateDesc(hashTagList,
						"Approved", community, pageable);
		List<Posting> postings = postingTags.stream()
				.map(PostingTag::getPosting)
				.filter(p -> "Active".equals(p.getStatus()))
				.distinct()
				.collect(Collectors.toList());

		List<CommunityUser> communityUsers = communityUserRepository.findByUserDetailUserId(userId);
		List<CommunityPostingResponseDTO> result = userServiceHelper.generateCommunityPostingResponseDTO(postings,
				communityUsers);
		return result;
	}

	@Override
	@Transactional
	public void joinCommunity(HttpServletRequest request, Long communityId) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		Community community = communityRepository.findById(communityId).get();
		CommunityUser communityUser = new CommunityUser();
		communityUser.setCommunity(community);
		communityUser.setUserDetail(new UserDetail(userId));
		communityUser.setIsModerator(false);
		communityUser.setCreatedDate(new Date());
		communityUserRepository.save(communityUser);

		community.setMemberCount(community.getMemberCount() + 1);
		communityRepository.save(community);

	}

	@Override
	@Transactional
	public void exitCommunity(HttpServletRequest request, Long communityId) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		CommunityUser communityUser = communityUserRepository.findByUserDetailUserIdAndCommunityId(userId, communityId);
		communityUserRepository.delete(communityUser);
		Community community = communityUser.getCommunity();
		community.setMemberCount(community.getMemberCount() - 1);
		communityRepository.save(community);

	}

	@Override
	public List<PostSoftwareResponseDTO> listSoftware(ListingRequestDTO listingRequestDTO) {
		int page = listingRequestDTO.getPage();
		int size = listingRequestDTO.getSize();
		String sortBy = listingRequestDTO.getSortBy();
		String direction = listingRequestDTO.getDirection();
		List<FilterRequestDTO> filters = listingRequestDTO.getFilters();
		Pageable pageable = PageRequest.of(page, size,
				direction.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

		List<Software> softwareList = softwareRepository
				.findAll((Specification<Software>) (root, query, criteriaBuilder) -> {
					List<Predicate> predicates = new ArrayList<>();
					addFilterCondition(filters, root, criteriaBuilder, predicates);
					// Add condition for Status being "Active" or "Inactive"
					predicates.add(criteriaBuilder.or(criteriaBuilder.equal(root.get("status"), "Active"),
							criteriaBuilder.equal(root.get("status"), "Inactive")));
					return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
				}, pageable).getContent();
		return userServiceHelper.generatePostSoftwareResponseDTOs(softwareList);
	}

	@Override
	public List<PostSoftwareResponseDTO> getSoftwareByTagId(HttpServletRequest request, Long tagId, int page,
															int size) {
		Pageable pageable = PageRequest.of(page, size);
		List<SoftwareTag> softwareList = softwareTagRepository.findByHashTagId(tagId, pageable);
		return userServiceHelper.generatePostSoftwareResponseDTOsByTag(softwareList);
	}

	@Override
	public List<CommunityUserDTO> getCommunityMembers(HttpServletRequest request, Long communityId) {
		List<CommunityUser> communityUser = communityUserRepository.findByCommunityId(communityId);
		return userServiceHelper.generateCommunityUserShortResponseDTO(communityUser);
	}

	@Override
	public List<PostingResponseDTO> getFeedList(HttpServletRequest request, Long communityId, int page, int size) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		Pageable pageable = PageRequest.of(page, size);
		List<Posting> postings = postingRepository.findByFeedCommunityIdOrderByUpdateddDateDesc(communityId, pageable);
		List<PostingResponseDTO> result = userServiceHelper.generatePostingResponseDTOs(postings);
		List<PostingLike> likes = postingLikeRepository.findByPostingInAndUserDetailUserId(postings, userId);

		userServiceHelper.setLikeFavouriteInPostingResponseDTO(result, likes, null, null);
		return result;
	}

	@Override
	public List<CommunityUserResponseDTO> getMyCommunityList(HttpServletRequest request, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		List<CommunityUser> communityUsers = communityUserRepository.findByUserDetailUserIdOrderByCreatedDateDesc(userId, pageable);
		return userServiceHelper.generateCommunityUserResponseDTO(communityUsers);
	}

	@Override
	public List<CommunityUserResponseDTO> getUserCommunityList(HttpServletRequest request, Long userId, int page,
															   int size) {
		Pageable pageable = PageRequest.of(page, size);
		List<CommunityUser> communityUsers = communityUserRepository.findByUserDetailUserId(userId, pageable);
		return userServiceHelper.generateCommunityUserResponseDTO(communityUsers);
	}

	@Override
	public List<CommunityUserResponseDTO> getCommunityListByUserId(HttpServletRequest request, Long userId) {
		List<CommunityUser> communityUsers = communityUserRepository.findByUserDetailUserId(userId);
		return userServiceHelper.generateCommunityUserResponseDTO(communityUsers);
	}

	@Override
	public Set<HashTag> getFavouriteTagListByUserId(HttpServletRequest request, Long userId) {
		List<UserfavouriteTag> userfavouritePostings = userfavouriteTagRepository.findByUserId(userId);
		Set<HashTag> result = userServiceHelper.generateHashTagForFav(userfavouritePostings);
		return result;
	}

	@Override
	public List<InternshipResponseDTO> getInternshipsByTagId(HttpServletRequest request, Long tagId, int page,
															 int size) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		Pageable pageable = PageRequest.of(page, size);
		List<Internship> internships = internshipRepository
				.findByCareerTagsHashTagIdAndStatusOrderByCreatedDateDesc(tagId, "Active", pageable);
		List<CareerUser> careerUsers = careerUserRepository.findByUserDetailUserId(userId);
		List<InternshipResponseDTO> result = userServiceHelper.generateInternshipResponse(internships, careerUsers,
				null);
		return result;
	}

	@Override
	public void careerApply(HttpServletRequest request, CareerApplyRequestDTO careerApplyRequestDTO) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		CareerUser careerUser = new CareerUser();
		if (careerApplyRequestDTO.getCareerType() == DocumentTypeEnum.INTERNSHIP) {

			careerUser.setCareer(careerRepository.findByInternshipId(careerApplyRequestDTO.getId()));
		}
		if (careerApplyRequestDTO.getCareerType() == DocumentTypeEnum.JOB) {
			careerUser.setCareer(careerRepository.findByJobId(careerApplyRequestDTO.getId()));
		}
		if (careerApplyRequestDTO.getCareerType() == DocumentTypeEnum.PROJECT) {
			careerUser.setCareer(careerRepository.findByProjectId(careerApplyRequestDTO.getId()));
		}
		if (careerApplyRequestDTO.getCareerType() == DocumentTypeEnum.CERTIFICATION) {
			careerUser.setCareer(careerRepository.findByCertificationId(careerApplyRequestDTO.getId()));
		}
		careerUser.setUserDetail(new UserDetail(userId));
		careerUser.setStatus("Applied");
		careerUserRepository.save(careerUser);

		if (careerApplyRequestDTO.getTeamMembersUserId() != null) {
			for (Long teamMemberId : careerApplyRequestDTO.getTeamMembersUserId()) {
				CareerUser teamUser = new CareerUser();
				teamUser.setCareer(careerUser.getCareer());
				teamUser.setUserDetail(new UserDetail(teamMemberId));
				teamUser.setStatus("Applied");
				careerUserRepository.save(teamUser);
			}
		}

		// Send notification to career owner (admin who created the resource)
		UserDetail applicant = userRepository.findById(userId).orElse(null);
		String actorName = applicant != null ? applicant.getFirstName() + " " + applicant.getLastName() : "User";

		UserDetail owner = null;
		String title = "";
		String companyName = "";
		String entityType = careerApplyRequestDTO.getCareerType().getCode();
		Long entityId = careerApplyRequestDTO.getId();

		if (careerApplyRequestDTO.getCareerType() == DocumentTypeEnum.INTERNSHIP) {
			Internship internship = internshipRepository.findById(careerApplyRequestDTO.getId()).orElse(null);
			if (internship != null) {
				owner = internship.getCreatedBy();
				title = internship.getTitle();
				companyName = internship.getCompanyName();
			}
		} else if (careerApplyRequestDTO.getCareerType() == DocumentTypeEnum.JOB) {
			Job job = jobRepository.findById(careerApplyRequestDTO.getId()).orElse(null);
			if (job != null) {
				owner = job.getCreatedBy();
				title = job.getDesignation();
				companyName = job.getCompanyName();
			}
		} else if (careerApplyRequestDTO.getCareerType() == DocumentTypeEnum.CERTIFICATION) {
			Certification cert = certificationRepository.findById(careerApplyRequestDTO.getId()).orElse(null);
			if (cert != null) {
				owner = cert.getCreatedBy();
				title = cert.getTitle();
			}
		}

		if (owner != null && !owner.getUserId().equals(userId)) {
			String extraJson;
			if (companyName != null && !companyName.isEmpty()) {
				extraJson = String.format("{\"actorUserName\":\"%s\",\"title\":\"%s\",\"companyName\":\"%s\"}",
						actorName.replace("\\\"", "'"),
						title.replace("\\\"", "'"),
						companyName.replace("\\\"", "'"));
			} else {
				extraJson = String.format("{\"actorUserName\":\"%s\",\"title\":\"%s\"}",
						actorName.replace("\\\"", "'"),
						title.replace("\\\"", "'"));
			}

			notificationService.createNotification(
					owner.getUserId(),
					userId,
					"APPLY",
					entityType,
					entityId,
					null,
					extraJson);
		}

		// Send confirmation email to applicant
		if (applicant != null && applicant.getEmailId() != null && !applicant.getEmailId().isEmpty()) {
			String subject = null;
			String body = null;
			switch (careerApplyRequestDTO.getCareerType()) {
				case INTERNSHIP:
					subject = "Internship Application Submitted - " + title + " at " + companyName;
					body = String.format("Your application has been submitted successfully.<br/>Your application for Internship <strong>%s</strong> at <strong>%s</strong> has been sent to the organisation. Kindly wait for the response from the team.", title, companyName);
					break;
				case JOB:
					subject = "Job Application Submitted - " + title + " at " + companyName;
					body = String.format("Application submitted successfully. Your application for Job %s at %s has been sent to the organisation. Kindly wait for the response from the team.", title, companyName);
					break;
				case CERTIFICATION:
					subject = "Certification Application Submitted - " + title;
					body = String.format("Application submitted successfully. Your application for Certification %s has been sent to the organisation. Kindly wait for the response from the team.", title);
					break;
				case PROJECT:
					// For project, confirmation mail is sent later when all members accept
					break;
				default:
					subject = "Application Submitted";
					body = "<p>Your application has been submitted successfully.</p>";
			}

			if (subject != null && body != null) {
				String toEmail;
				try {
					toEmail = encryptDecryptUtil.decrypt(applicant.getEmailId());
				} catch (Exception e) {
					toEmail = applicant.getEmailId(); // fallback if decrypt fails
				}
				emailService.sendHtmlEmail(toEmail, subject, "<p>" + body + "</p>", false);
			}
		}

		// If this is a PROJECT application, persist a ProjectTeam with members
		if (careerApplyRequestDTO.getCareerType() == DocumentTypeEnum.PROJECT) {
			try {
				Project projectEntity = projectRepository.findById(careerApplyRequestDTO.getId()).orElse(null);
				if (projectEntity != null) {
					// Create team record
					ProjectTeam team = new ProjectTeam();
					team.setProject(projectEntity);
					team.setLeader(new UserDetail(userId));
					team.setStatus("PENDING");
					Date now = new Date();
					team.setCreatedAt(now);
					team.setUpdatedAt(now);

					team = projectTeamRepository.save(team);

					// Prepare team members from emails
					if (careerApplyRequestDTO.getTeamMemberEmails() != null) {
						for (String emailStr : careerApplyRequestDTO.getTeamMemberEmails()) {
							if (emailStr == null || emailStr.trim().isEmpty()) continue;
							String email = emailStr.trim().toLowerCase();

							// Skip if matches leader email
							UserDetail leaderDetail = applicant; // applicant fetched below; ensure not null
							String leaderEmail = null;
							try {
								if (leaderDetail != null && leaderDetail.getEmailId() != null) {
									leaderEmail = encryptDecryptUtil.decrypt(leaderDetail.getEmailId()).toLowerCase();
								}
							} catch (Exception ignored) {}
							if (leaderEmail != null && leaderEmail.equals(email)) {
								continue;
							}

							ProjectTeamMember member = new ProjectTeamMember();
							member.setTeam(team);
							member.setEmail(email);
							member.setInviteToken(java.util.UUID.randomUUID().toString());
							member.setStatus("INVITED");
							member.setInvitedAt(now);

							// Try to find registered user by decrypting stored emails (simple scan)
							UserDetail matchedUser = null;
							try {
								java.util.List<UserDetail> allUsers = userRepository.findAll();
								for (UserDetail u : allUsers) {
									try {
										String dec = encryptDecryptUtil.decrypt(u.getEmailId());
										if (email.equalsIgnoreCase(dec)) { matchedUser = u; break; }
									} catch (Exception ignored) {}
								}
							} catch (Exception ignored) {}
							if (matchedUser != null) {
								member.setUser(matchedUser);
							}

							projectTeamMemberRepository.save(member);

							// Send real-time notification if the user already exists in portal
							if (matchedUser != null) {
								try {
									String leaderName = (applicant != null ? applicant.getFirstName() + " " + applicant.getLastName() : "Team Lead");
									String extraJsonInv = String.format(
											"{\"actorUserName\":\"%s\",\"projectTitle\":\"%s\",\"inviteToken\":\"%s\"}",
											leaderName.replace("\\\"", "'"),
											projectEntity.getTitle().replace("\\\"", "'"),
											member.getInviteToken());

									notificationService.createNotification(
											matchedUser.getUserId(),
											userId,
											"PROJECT_INVITE",
											"PROJECT",
											projectEntity.getId(),
											null,
											extraJsonInv);
								} catch (Exception ignored) {}
							}

							// Send e-mail invitation to external address (user not yet registered)
							if (matchedUser == null) {
								try {
									String origin = null;
									try {
										origin = ((javax.servlet.http.HttpServletRequest) org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes()
												.resolveReference("request")).getHeader("Origin");
									} catch (Exception ignore) {}
									if (origin == null || origin.isEmpty()) {
										// Fallbacks for known envs
										origin = email.endsWith("@techcell.in") ? "https://techcell.in" : "https://techcell.org";
									}
									String inviteLink = origin + "/invite/project-team/" + member.getInviteToken();

									String subj = "Invitation to join project team – " + projectEntity.getTitle();
									String html = "<p>Hello,</p>" +
											"<p>You have been invited to join the project <strong>" + projectEntity.getTitle().replace("\"", "&quot;") + "</strong> on TechCell.</p>" +
											"<p>Please click the link below (or copy & paste it in your browser) to accept the invitation and create your account:</p>" +
											"<p><a href='" + inviteLink + "' target='_blank'>" + inviteLink + "</a></p>" +
											"<p>The link will expire in 30 days.</p>" +
											"<p>Regards,<br/>TechCell Team</p>";

									emailService.sendHtmlEmail(email, subj, html, false);
									logger.info("Invitation email sent to {}", email);
								} catch (Exception e) {
									logger.error("Failed to send invite email to {}", email, e);
								}
							}
						}
					}
				}
			} catch (Exception e) {
				// log but do not fail application
				logger.error("Error while creating project team", e);
			}
		}
	}

	@Override
	public void careerApprove(HttpServletRequest request, CareerApproveRequestDTO careerApplyRequestDTO) {
		// Handle PROJECT approval on team-basis first
		if (careerApplyRequestDTO.getCareerType() == DocumentTypeEnum.PROJECT
		        && (careerApplyRequestDTO.getUserId() == null || careerApplyRequestDTO.getUserId() == 0)) {
		    // Treat the incoming id as ProjectTeam id
		    Long teamId = careerApplyRequestDTO.getId();
		    if (teamId != null) {
		        com.simtech.entity.ProjectTeam team = projectTeamRepository.findById(teamId).orElse(null);
		        if (team != null) {
		            String incomingStatus = careerApplyRequestDTO.getStatus();
		            String teamStatus = null;
		            if ("Accepted".equalsIgnoreCase(incomingStatus) || "Approve".equalsIgnoreCase(incomingStatus) || "Approved".equalsIgnoreCase(incomingStatus)) {
		                teamStatus = "APPROVED";
		            } else if ("Rejected".equalsIgnoreCase(incomingStatus)) {
		                teamStatus = "REJECTED";
		            }

		            if (teamStatus != null) {
		                team.setStatus(teamStatus);
		                team.setUpdatedAt(new java.util.Date());
		                projectTeamRepository.save(team);

		                // Send realtime notification to team leader
		                try {
		                    com.simtech.entity.UserDetail leader = team.getLeader();
		                    if (leader != null) {
		                        Long adminId = Long.valueOf(request.getAttribute("userId").toString());

		                        // Prepare extraJson with project title & company logo as actorPhoto
		                        String logoPart = "";
		                        try {
		                            byte[] logoBytes = team.getProject() != null ? team.getProject().getCompanyLogo() : null;
		                            if (logoBytes != null && logoBytes.length > 0) {
		                                String logoB64 = java.util.Base64.getEncoder().encodeToString(logoBytes);
		                                logoPart = String.format(",\"actorPhoto\":\"%s\"", logoB64);
		                            }
		                        } catch (Exception ignore) {}

		                        String projectTitleEsc = team.getProject() != null ? team.getProject().getTitle().replace("\\\"", "'") : "Project";
		                        String adminNameEsc = leader.getFirstName() + " " + leader.getLastName();
		                        String extraJson = String.format("{\"actorUserName\":\"%s\",\"projectTitle\":\"%s\"%s}", adminNameEsc, projectTitleEsc, logoPart);

		                        // Fetch admin name for message
		                        com.simtech.entity.UserDetail adminUser = userRepository.findById(adminId).orElse(null);
		                        String adminName = adminUser != null ? (adminUser.getFirstName() + " " + adminUser.getLastName()) : "Admin";

		                        String eventType;
		                        String messageText;
		                        if ("APPROVED".equals(teamStatus)) {
		                            eventType = "PROJECT_TEAM_APPROVED";
		                            messageText = String.format("%s accepted your team application for project %s", adminName, projectTitleEsc);
		                        } else {
		                            eventType = "PROJECT_TEAM_REJECTED";
		                            messageText = String.format("%s rejected your team application for project %s", adminName, projectTitleEsc);
		                        }

		                        // Ensure actorUserName uses admin's name for bold/click in UI
		                        String adminNameEscFinal = adminName.replace("\"", "\\\"");
		                        extraJson = String.format("{\"actorUserName\":\"%s\",\"projectTitle\":\"%s\"%s}", adminNameEscFinal, projectTitleEsc, logoPart);

		                        notificationService.createNotification(
		                                leader.getUserId(),
		                                adminId,
		                                eventType,
		                                "PROJECT",
		                                team.getProject() != null ? team.getProject().getId() : null,
		                                messageText,
		                                extraJson);
		                    }
		                } catch (Exception e) {
		                    // log but continue
		                    logger.error("Error sending notification for team approval", e);
		                }
		            }
		        }
		    }
		    return; // Skip legacy per-user flow
		}

		CareerUser careerUser = null;
		if (careerApplyRequestDTO.getCareerType() == DocumentTypeEnum.INTERNSHIP) {
			careerUser = careerUserRepository.findByUserDetailUserIdAndCareerInternshipId(
					careerApplyRequestDTO.getUserId(), careerApplyRequestDTO.getId());
		}
		if (careerApplyRequestDTO.getCareerType() == DocumentTypeEnum.JOB) {
			careerUser = careerUserRepository.findByUserDetailUserIdAndCareerJobId(careerApplyRequestDTO.getUserId(),
					careerApplyRequestDTO.getId());
		}
		if (careerApplyRequestDTO.getCareerType() == DocumentTypeEnum.PROJECT) {
			careerUser = careerUserRepository.findByUserDetailUserIdAndCareerProjectId(
					careerApplyRequestDTO.getUserId(), careerApplyRequestDTO.getId());
		}
		if (careerApplyRequestDTO.getCareerType() == DocumentTypeEnum.CERTIFICATION) {
			careerUser = careerUserRepository.findByUserDetailUserIdAndCareerCertificationId(
					careerApplyRequestDTO.getUserId(), careerApplyRequestDTO.getId());
		}
		if(careerUser!=null){
		careerUser.setStatus(careerApplyRequestDTO.getStatus());
		careerUserRepository.save(careerUser);
		}
	}

	@Override
	public List<JobResponseDTO> getJobsByTagId(HttpServletRequest request, Long tagId, int page, int size) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		Pageable pageable = PageRequest.of(page, size);
		List<Job> jobs = jobRepository.findByCareerTagsHashTagIdAndStatusOrderByCreatedDateDesc(tagId, "Active",
				pageable);
		List<CareerUser> careerUsers = careerUserRepository.findByUserDetailUserId(userId);
		List<JobResponseDTO> result = userServiceHelper.generateJobResponse(jobs, careerUsers, null);
		return result;
	}

	@Override
	public List<ProjectResponseDTO> getProjectsByTagId(HttpServletRequest request, Long tagId, int page, int size) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		Pageable pageable = PageRequest.of(page, size);
		List<Project> jobs = projectRepository.findByCareerTagsHashTagIdAndStatusOrderByCreatedDateDesc(tagId, "Active",
				pageable);
		List<CareerUser> careerUsers = careerUserRepository.findByUserDetailUserId(userId);
		List<ProjectResponseDTO> result = userServiceHelper.generateProjectResponse(jobs, careerUsers, null);
		return result;
	}

	@Override
	@Transactional
	public void viewPost(HttpServletRequest request, Long postId) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());

		// If this user has already viewed the post, do not increment
		if (postViewRepository.existsByPostIdAndUserId(postId, userId)) {
			return;
		}

		// Increment view counter
		Posting posting = postingRepository.findById(postId)
				.orElseThrow(() -> new BusinessException("Posting not found"));
		posting.setViews(posting.getViews() + 1);
		postingRepository.save(posting);

		// Persist view tracking record
		postViewRepository.save(new PostView(postId, userId));
	}

	@Override
	public List<CareerResponseDTO> getMyAppliedCareerList(HttpServletRequest request, int page, int size) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		Pageable pageable = PageRequest.of(page, size);
		List<CareerUser> careers = careerUserRepository.findByUserDetailUserIdOrderByCareerCreatedDateDesc(userId, pageable);
		return userServiceHelper.generateMyCareerResponseDTO(careers);
	}

	@Override
	public List<CareerResponseDTO> getCareerList(HttpServletRequest request, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		List<Career> careers = careerRepository.findAllByStatusOrderByCreatedDateDesc("Active", pageable);
		return userServiceHelper.generateCareerResponseDTO(careers);
	}

	@Override
	public void approvePost(HttpServletRequest request, ApprovePostRequestDTO approvePostRequestDTO) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		Posting posting = postingRepository.findById(approvePostRequestDTO.getPostingId())
			.orElseThrow(() -> new BusinessException("Posting not found"));
		
		posting.setObjectStatus(approvePostRequestDTO.getObjectStatus().getCode());
		
		// Set rejection reason if content is rejected
		if (approvePostRequestDTO.getObjectStatus() == ObjectStatus.REJECTED) {
			posting.setReason(approvePostRequestDTO.getReason());
		}
		
		postingRepository.save(posting);

		// Send notifications to followers if post approved
		if (approvePostRequestDTO.getObjectStatus() == ObjectStatus.APPROVED) {
			// Gather tag ids
			List<PostingTag> tags = postingTagRepository.findByPostingId(posting.getId());
			java.util.List<Long> tagIds = tags.stream()
					.map(t -> t.getHashTag().getId())
					.collect(java.util.stream.Collectors.toList());

			String actorName = posting.getPostedUser().getFirstName() + " " + posting.getPostedUser().getLastName();
			String safeTitle = posting.getTitle() != null ? posting.getTitle().replaceAll("\"", "\\\"") : "";
			String extraJson = String.format("{\"postingTitle\":\"%s\",\"actorUserName\":\"%s %s\"}",
					safeTitle,
					actorName.replace("\"", "\\\""),
					actorName.replace("\"", "\\\""));

			notificationService.createNotificationsForTags(
					posting.getPostedUser().getUserId(),
					tagIds,
					"CREATE",
					posting.getPostType(),
					posting.getId(),
					extraJson);
		}

		// Notify owner about approval / rejection
		UserDetail owner = posting.getPostedUser();
		if (owner != null && !owner.getUserId().equals(userId)) {
			UserDetail approver = userRepository.findById(userId).orElse(null);
			String actorName = approver != null ? approver.getFirstName() + " " + approver.getLastName() : "Moderator";

			String statusText = approvePostRequestDTO.getObjectStatus() == ObjectStatus.APPROVED ? "accepted" : "rejected";

			String extraJson = String.format("{\"actorUserName\":\"%s\",\"postingTitle\":\"%s\"%s}",
					actorName.replace("\\\"", "'"),
					posting.getTitle().replace("\\\"", "'"),
					approvePostRequestDTO.getObjectStatus() == ObjectStatus.REJECTED && approvePostRequestDTO.getReason()!=null ?
							String.format(",\"reason\":\"%s\"", approvePostRequestDTO.getReason().replace("\\\"", "'")) : "");

			String eventType = approvePostRequestDTO.getObjectStatus() == ObjectStatus.APPROVED ? "APPROVE" : "REJECT";

			notificationService.createNotification(
					owner.getUserId(),
					userId,
					eventType,
					posting.getPostType(),
					posting.getId(),
					null,
					extraJson);
		}
	}

	@Override
	public HashTag getMyCommunityTagList(HttpServletRequest request) {
		HashTag result = null;
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		CommunityUser communityUser = communityUserRepository.findByUserDetailUserIdAndIsModerator(userId, true);
		if (communityUser != null) {
			Posting posting = postingRepository.findByCommunityId(communityUser.getCommunity().getId());
			result = posting.getPostingTags().stream()
					.filter(postingTag -> postingTag.getIsPrimary() != null && postingTag.getIsPrimary())
					.map(PostingTag::getHashTag).findFirst().orElse(null);
		}
		return result;
	}

	@Override
	@Transactional
	public String assignModerator(HttpServletRequest request, CommunityModeratorRequestDTO dto) {
		Long newModId = dto.getModerator();
		Long targetCommunityId = dto.getCommunityId();

		UserDetail newModUser = userRepository.findById(newModId).orElseThrow();
		Community targetCommunity = communityRepository.findById(targetCommunityId).orElseThrow();

		List<String> removalMsgs = new ArrayList<>();

		// 1. If the selected user already moderates another community – detach them
		CommunityUser existingLink = communityUserRepository.findByUserDetailUserIdAndIsModerator(newModId, true);
		if (existingLink != null) {
			Community oldCommunity = existingLink.getCommunity();
			communityUserRepository.delete(existingLink);

			// Clear moderator reference in posting of old community
			Posting oldPosting = postingRepository.findByCommunityId(oldCommunity.getId());
			if (oldPosting != null) {
				oldPosting.setModerator(null);
				postingRepository.save(oldPosting);
			}

			removalMsgs.add(newModUser.getFirstName() + " " + newModUser.getLastName() +
					" as moderator for " + oldCommunity.getTitle());
		}

		// 2. If target community already has a moderator – detach them as well
		List<CommunityUser> targetMods = communityUserRepository.findByCommunityIdAndIsModerator(targetCommunityId, true);
		if (!targetMods.isEmpty()) {
			CommunityUser prev = targetMods.get(0);
			UserDetail prevUser = prev.getUserDetail();
			communityUserRepository.delete(prev);

			removalMsgs.add(prevUser.getFirstName() + " " + prevUser.getLastName() +
					" as moderator for " + targetCommunity.getTitle());
		}

		// 3. Create new moderator link for the target community
		CommunityUser newLink = new CommunityUser();
		newLink.setCommunity(targetCommunity);
		newLink.setUserDetail(newModUser);
		newLink.setIsModerator(true);
		newLink.setCreatedDate(new Date());
		communityUserRepository.save(newLink);

		// Update posting table for target community
		Posting targetPosting = postingRepository.findByCommunityId(targetCommunityId);
		if (targetPosting != null) {
			targetPosting.setModerator(new UserDetail(newModId));
			postingRepository.save(targetPosting);
		}

		// Build final user-friendly message using requested grammar
		StringBuilder message = new StringBuilder();
		if (!removalMsgs.isEmpty()) {
			message.append("Removed ");
			message.append(String.join(" and ", removalMsgs));
			message.append(". ");
		}
		message.append("Assigned ")
			   .append(newModUser.getFirstName()).append(" ").append(newModUser.getLastName())
			   .append(" as moderator for ")
			   .append(targetCommunity.getTitle()).append(".");

		return message.toString();
	}

	@Override
	public void contactUs(HttpServletRequest request, ContactRequestDTO contactRequestDTO) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		UserDetail userDetail = userRepository.findById(userId).get();
		ContactUs contact = userServiceHelper.generatecontactUsObj(userId, contactRequestDTO);
		contactUsRepository.save(contact);

		// Send email notification
		userServiceHelper.sendContactNotification(
				contactRequestDTO.getCategory(),
				contactRequestDTO.getSubject(),
				contactRequestDTO.getMessage(),
				userDetail
		);
	}

	@Override
	public Map<String, Long> getCounts(HttpServletRequest request) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());

		Map<String, Long> result = new HashMap<String, Long>();
		Long contentsCount = postingRepository.countByPostedUserUserIdAndStatusAndPostTypeIn(userId, "Active",
				homePageDocList);
		Long careersCount = careerUserRepository.countByUserDetailUserId(userId);
		Long communityCount = communityUserRepository.countByUserDetailUserId(userId);

		result.put("contentsCount", contentsCount);
		result.put("careersCount", careersCount);
		result.put("communityCount", communityCount);
		return result;
	}

	@Override
	public List<InternshipResponseDTO> listInternships(HttpServletRequest request,
													   ListingRequestDTO listingRequestDTO) {
		int page = listingRequestDTO.getPage();
		int size = listingRequestDTO.getSize();
		String sortBy = listingRequestDTO.getSortBy();
		String direction = listingRequestDTO.getDirection();
		List<FilterRequestDTO> filters = listingRequestDTO.getFilters();
		Pageable pageable = PageRequest.of(page, size,
				direction.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

		List<Internship> internships = internshipRepository
				.findAll((Specification<Internship>) (root, query, criteriaBuilder) -> {
					List<Predicate> predicates = new ArrayList<>();
					addFilterCondition(filters, root, criteriaBuilder, predicates);
					predicates.add(criteriaBuilder.or(criteriaBuilder.equal(root.get("status"), "Active"),
							criteriaBuilder.equal(root.get("status"), "Inactive")));
					return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
				}, pageable).getContent();
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		List<CareerUser> careerUsers = careerUserRepository.findByUserDetailUserId(userId);
		List<CareerUser> careerUsersApplied = careerUserRepository.findByCareerInternshipIn(internships);
		List<InternshipResponseDTO> result = userServiceHelper.generateInternshipResponse(internships, careerUsers,
				careerUsersApplied);
		return result;
	}

	@Override
	public List<ProjectResponseDTO> listProjects(HttpServletRequest request, ListingRequestDTO listingRequestDTO) {
		int page = listingRequestDTO.getPage();
		int size = listingRequestDTO.getSize();
		String sortBy = listingRequestDTO.getSortBy();
		String direction = listingRequestDTO.getDirection();
		List<FilterRequestDTO> filters = listingRequestDTO.getFilters();
		Pageable pageable = PageRequest.of(page, size,
				direction.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());
		List<Project> projects = projectRepository.findAll((Specification<Project>) (root, query, criteriaBuilder) -> {
			List<Predicate> predicates = new ArrayList<>();
			addFilterCondition(filters, root, criteriaBuilder, predicates);
			// Add condition for Status being "Active" or "Inactive"
			predicates.add(criteriaBuilder.or(criteriaBuilder.equal(root.get("status"), "Active"),
					criteriaBuilder.equal(root.get("status"), "Inactive")));
			return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
		}, pageable).getContent();
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		List<CareerUser> careerUsers = careerUserRepository.findByUserDetailUserId(userId);
		List<CareerUser> careerUsersApplied = careerUserRepository.findByCareerProjectIn(projects);
		List<ProjectResponseDTO> result = userServiceHelper.generateProjectResponse(projects, careerUsers,
				careerUsersApplied);
		return result;
	}

	@Override
	public List<JobResponseDTO> listJobs(HttpServletRequest request, ListingRequestDTO listingRequestDTO) {
		int page = listingRequestDTO.getPage();
		int size = listingRequestDTO.getSize();
		String sortBy = listingRequestDTO.getSortBy();
		String direction = listingRequestDTO.getDirection();
		List<FilterRequestDTO> filters = listingRequestDTO.getFilters();
		Pageable pageable = PageRequest.of(page, size,
				direction.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());
		List<Job> jobs = jobRepository.findAll((Specification<Job>) (root, query, criteriaBuilder) -> {
			List<Predicate> predicates = new ArrayList<>();
			addFilterCondition(filters, root, criteriaBuilder, predicates);
			// Add condition for Status being "Active" or "Inactive"
			predicates.add(criteriaBuilder.or(criteriaBuilder.equal(root.get("status"), "Active"),
					criteriaBuilder.equal(root.get("status"), "Inactive")));
			return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
		}, pageable).getContent();
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		List<CareerUser> careerUsers = careerUserRepository.findByUserDetailUserId(userId);
		List<CareerUser> careerUsersApplied = careerUserRepository.findByCareerJobIn(jobs);
		List<JobResponseDTO> result = userServiceHelper.generateJobResponse(jobs, careerUsers, careerUsersApplied);
		return result;
	}

	@Override
	public void updateCareerStatus(HttpServletRequest request, UpdateStatusRequestDTO careerDeleteRequestDTO) {
		Career career = null;
		if (careerDeleteRequestDTO.getCareerType() == DocumentTypeEnum.INTERNSHIP) {
			career = careerRepository.findByInternshipId(careerDeleteRequestDTO.getId());
			Internship internship = career.getInternship();
			internship.setStatus(careerDeleteRequestDTO.getStatus());
			internship.setReason(careerDeleteRequestDTO.getReason());
			internshipRepository.save(internship);
		}
		if (careerDeleteRequestDTO.getCareerType() == DocumentTypeEnum.JOB) {
			career = careerRepository.findByJobId(careerDeleteRequestDTO.getId());
			Job job = career.getJob();
			job.setStatus(careerDeleteRequestDTO.getStatus());
			job.setReason(careerDeleteRequestDTO.getReason());
			jobRepository.save(job);

		}
		if (careerDeleteRequestDTO.getCareerType() == DocumentTypeEnum.PROJECT) {
			career = careerRepository.findByProjectId(careerDeleteRequestDTO.getId());
			Project project = career.getProject();
			project.setStatus(careerDeleteRequestDTO.getStatus());
			project.setReason(careerDeleteRequestDTO.getReason());
			projectRepository.save(project);
		}
		if (careerDeleteRequestDTO.getCareerType() == DocumentTypeEnum.CERTIFICATION) {
			career = careerRepository.findByCertificationId(careerDeleteRequestDTO.getId());
			Certification certification = career.getCertification();
			certification.setStatus(careerDeleteRequestDTO.getStatus());
			certification.setReason(careerDeleteRequestDTO.getReason());
			certificationRepository.save(certification);
		}
		career.setStatus(careerDeleteRequestDTO.getStatus());
		careerRepository.save(career);
	}

	@Override
	public List<CertificationResponseDTO> getCertificationByTagId(HttpServletRequest request, Long tagId, int page,
																  int size) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		Pageable pageable = PageRequest.of(page, size);
		List<Certification> certifications = certificationRepository
				.findByCareerTagsHashTagIdAndStatusOrderByCreatedDateDesc(tagId, "Active", pageable);
		List<CareerUser> careerUsers = careerUserRepository.findByUserDetailUserId(userId);
		List<CertificationResponseDTO> result = userServiceHelper.generateCertificationResponse(certifications,
				careerUsers, null);
		return result;
	}

	@Override
	public List<CertificationResponseDTO> listCertifications(HttpServletRequest request,
															 ListingRequestDTO listingRequestDTO) {
		int page = listingRequestDTO.getPage();
		int size = listingRequestDTO.getSize();
		String sortBy = listingRequestDTO.getSortBy();
		String direction = listingRequestDTO.getDirection();
		List<FilterRequestDTO> filters = listingRequestDTO.getFilters();
		Pageable pageable = PageRequest.of(page, size,
				direction.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());
		List<Certification> certifications = certificationRepository
				.findAll((Specification<Certification>) (root, query, criteriaBuilder) -> {
					List<Predicate> predicates = new ArrayList<>();
					addFilterCondition(filters, root, criteriaBuilder, predicates);
					// Add condition for Status being "Active" or "Inactive"
					predicates.add(criteriaBuilder.or(criteriaBuilder.equal(root.get("status"), "Active"),
							criteriaBuilder.equal(root.get("status"), "Inactive")));
					return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
				}, pageable).getContent();
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		List<CareerUser> careerUsers = careerUserRepository.findByUserDetailUserId(userId);
		List<CareerUser> careerUsersApplied = careerUserRepository.findByCareerCertificationIn(certifications);
		List<CertificationResponseDTO> result = userServiceHelper.generateCertificationResponse(certifications,
				careerUsers, careerUsersApplied);
		return result;
	}

	@Override
	public void updatePostingStatus(HttpServletRequest request, UpdateStatusRequestDTO updateStatusRequestDTO) {
		Posting posting = postingRepository.findById(updateStatusRequestDTO.getId()).get();
		posting.setStatus(updateStatusRequestDTO.getStatus());
		posting.setReason(updateStatusRequestDTO.getReason());
		posting.setUpdateddDate(new Date());
		postingRepository.save(posting);
	}

	@Override
	public void updateSoftwareStatus(HttpServletRequest request, UpdateStatusRequestDTO updateStatusRequestDTO) {
		Software software = softwareRepository.findById(updateStatusRequestDTO.getId()).get();
		software.setStatus(updateStatusRequestDTO.getStatus());
		software.setUpdateddDate(new Date());
		softwareRepository.save(software);
	}

	@Override
	public List<PostingResponseDTO> listPostings(HttpServletRequest request, ListingRequestDTO listingRequestDTO) {
		String role = request.getAttribute("role").toString();
		DocumentTypeEnum documentTypeEnum = listingRequestDTO.getDocumentTypeEnum();
		int page = listingRequestDTO.getPage();
		int size = listingRequestDTO.getSize();
		String sortBy = listingRequestDTO.getSortBy();
		String direction = listingRequestDTO.getDirection();
		List<FilterRequestDTO> filters = listingRequestDTO.getFilters();
		Pageable pageable = PageRequest.of(page, size,
				direction.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());
		List<Posting> postings = postingRepository.findAll((Specification<Posting>) (root, query, criteriaBuilder) -> {
			List<Predicate> predicates = new ArrayList<>();
			addFilterCondition(filters, root, criteriaBuilder, predicates);
			predicates.add(criteriaBuilder.equal(root.get("postType"), documentTypeEnum.getCode()));
			predicates.add(criteriaBuilder.equal(root.get("objectStatus"), "Approved"));

			if ("Admin".equals(role)) {
				predicates.add(criteriaBuilder.or(criteriaBuilder.equal(root.get("status"), "Active"),
						criteriaBuilder.equal(root.get("status"), "Inactive")));
			} else {
				predicates.add(criteriaBuilder.equal(root.get("status"), "Active"));

			}
			// Add condition for Status being "Active" or "Inactive"

			return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
		}, pageable).getContent();

		// DEBUG: log out the IDs we fetched to trace duplicates
		if (logger.isDebugEnabled()) {
			logger.debug("listPostings fetched IDs: {}", postings.stream().map(Posting::getId).collect(Collectors.toList()));
		}

		List<PostingResponseDTO> result = userServiceHelper.generatePostingResponseDTOs(postings);
		if (logger.isDebugEnabled()) {
			logger.debug("listPostings returning {} DTOs", result.size());
		}
		return result;
	}

	private void addFilterCondition(List<FilterRequestDTO> filters, Root root, CriteriaBuilder criteriaBuilder,
									List<Predicate> predicates) {
		if (filters == null || filters.isEmpty()) {
			return;
		}

		for (FilterRequestDTO filterRequestDTO : filters) {
			String field = filterRequestDTO.getField();
			String operator = filterRequestDTO.getOperator();
			String value = filterRequestDTO.getValue();

			if (field == null || operator == null || value == null) {
				continue; // Skip invalid filter conditions
			}

// Parse the value to a date object if possible
			Date dateObject = parseDate(value);

			Predicate predicate = null;
			if (OPERATOR_LIKE.equals(operator)) {
				predicate = criteriaBuilder.like(getPath(root, filterRequestDTO, field), "%" + value + "%");
			} else if (OPERATOR_EQUALS.equals(operator)) {
				predicate = criteriaBuilder.equal(getPath(root, filterRequestDTO, field),
						dateObject != null ? dateObject : value);
			} else if (OPERATOR_GREATERTHAN.equals(operator)) {
				predicate = createComparisonPredicate(criteriaBuilder, filterRequestDTO, root, field, value, dateObject,
						true);
			} else if (OPERATOR_LESSTHAN.equals(operator)) {
				predicate = createComparisonPredicate(criteriaBuilder, filterRequestDTO, root, field, value, dateObject,
						false);
			}

			if (predicate != null) {
				predicates.add(predicate);
			}
		}
	}

	private Date parseDate(String value) {
		SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);
		dateFormat.setLenient(false); // Ensure strict parsing
		try {
			return dateFormat.parse(value);
		} catch (ParseException e) {
			return null;
		}
	}

	private <T> javax.persistence.criteria.Path<T> getPath(Root<Posting> root, FilterRequestDTO filterRequestDTO,
														   String field) {
		return filterRequestDTO.getChild() != null ? root.join(filterRequestDTO.getChild()).get(field)
				: root.get(field);
	}

	private Predicate createComparisonPredicate(CriteriaBuilder criteriaBuilder, FilterRequestDTO filterRequestDTO,
												Root<Posting> root, String field, String value, Date dateObject, boolean isGreaterThan) {
		if (dateObject != null) {
			return isGreaterThan ? criteriaBuilder.greaterThan(getPath(root, filterRequestDTO, field), dateObject)
					: criteriaBuilder.lessThan(getPath(root, filterRequestDTO, field), dateObject);
		} else {
			return isGreaterThan ? criteriaBuilder.greaterThan(getPath(root, filterRequestDTO, field), value)
					: criteriaBuilder.lessThan(getPath(root, filterRequestDTO, field), value);
		}
	}

	@Override
	public List<PostingCommentResponseDTO> getReplyComments(Long parentCommentId, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		List<PostingComment> postingComments = postingCommentRepository
				.findByparentCommentIdOrderByCommentTimeDesc(parentCommentId, pageable);
		List<PostingCommentResponseDTO> postingComment = userServiceHelper.PostingCommentResponse(postingComments);
		return postingComment;
	}

	@Override
	public void updateResume(HttpServletRequest request, MaintainResumeRequestDTO maintainResumeRequestDTO) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		Resume resume = resumeRepository.findByUserId(userId);
		if (resume == null) {
			resume = new Resume();
			resume.setUserId(userId);
		}
		if (maintainResumeRequestDTO.getResumePhoto() != null) {
			resume.setResumePhoto(maintainResumeRequestDTO.getResumePhoto());
		}
		if (maintainResumeRequestDTO.getResumeData() != null) {

			Gson gson = new Gson();

			// Convert object to JSON string
			String jsonString = gson.toJson(maintainResumeRequestDTO.getResumeData());
			resume.setResumeData(jsonString);
		}
		resume.setUpdatedDate(new Date());
		resumeRepository.save(resume);
	}

	@Override
	public Resume getResume(HttpServletRequest request, Long userId) {
		if (userId == null) {
			userId = Long.valueOf(request.getAttribute("userId").toString());
		}
		Resume resume = resumeRepository.findByUserId(userId);
		if (resume == null) {
			resume = new Resume();
			resume.setUserId(userId);
		}
		return resume;
	}

	@Override
	public List<CareerAppliedDTO> getCareerAppliedList(HttpServletRequest request, DocumentTypeEnum careerType, Long id,
													   String status, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		List<CareerUser> careerUsers = null;
		List<String> statusList = new ArrayList<String>();
		if (status != null) {
			statusList.add(status);
		} else {
			statusList = defaultCarrerStatus;
		}

		if (careerType == DocumentTypeEnum.INTERNSHIP) {
			careerUsers = careerUserRepository.findByCareerInternshipIdAndStatusIn(id, statusList, pageable);
		}
		if (careerType == DocumentTypeEnum.JOB) {
			careerUsers = careerUserRepository.findByCareerJobIdAndStatusIn(id, statusList, pageable);
		}
		if (careerType == DocumentTypeEnum.PROJECT) {
			// Translate status to team status list
			java.util.List<String> teamStatuses = new java.util.ArrayList<>();
			if (status == null) {
				teamStatuses.add("COMPLETE");
				teamStatuses.add("APPROVED");
				teamStatuses.add("REJECTED");
			} else if ("Applied".equalsIgnoreCase(status)) {
				teamStatuses.add("COMPLETE");
			} else if ("Accepted".equalsIgnoreCase(status)) {
				teamStatuses.add("APPROVED");
			} else if ("Rejected".equalsIgnoreCase(status)) {
				teamStatuses.add("REJECTED");
			}

			org.springframework.data.domain.Page<com.simtech.entity.ProjectTeam> teamPage = projectTeamRepository.findByProject_IdAndStatusIn(id, teamStatuses, pageable);
			java.util.List<com.simtech.entity.ProjectTeam> teams = teamPage.getContent();

			java.util.List<CareerAppliedDTO> targetList = new java.util.ArrayList<>();
			for (com.simtech.entity.ProjectTeam team : teams) {
				CareerAppliedDTO dto = new CareerAppliedDTO();
				dto.setTeamId(team.getId());
				dto.setStatus(team.getStatus().equals("COMPLETE") ? "Applied" : (team.getStatus().equals("APPROVED") ? "Accepted" : "Rejected"));
				dto.setUserDetail(userServiceHelper.generateUserDetailShortResponseDTO(team.getLeader()));
				java.util.List<UserDetailShortResponseDTO> membersDto = new java.util.ArrayList<>();
				for (com.simtech.entity.ProjectTeamMember m : team.getMembers()) {
					if (m.getUser() != null) {
						membersDto.add(userServiceHelper.generateUserDetailShortResponseDTO(m.getUser()));
					}
				}
				dto.setMembers(membersDto);
				targetList.add(dto);
			}
			return targetList;
		}
		if (careerType == DocumentTypeEnum.CERTIFICATION) {
			careerUsers = careerUserRepository.findByCareerCertificationIdAndStatusIn(id, statusList, pageable);
		}
		List<CareerAppliedDTO> targetList = careerUsers.stream().map(careerUser -> {
			CareerAppliedDTO careerAppliedDTO = new CareerAppliedDTO();
			careerAppliedDTO
					.setUserDetail(userServiceHelper.generateUserDetailShortResponseDTO(careerUser.getUserDetail()));
			careerAppliedDTO.setStatus(careerUser.getStatus());
			return careerAppliedDTO;
		}).collect(Collectors.toList());
		return targetList;
	}

	@Override
	public List<CommunityPostingResponseDTO> getCommunityListByTagId(HttpServletRequest request, Long tagId, int page,
																	 int size) {
		Pageable pageable = PageRequest.of(page, size);
		List<PostingTag> postingTags = postingTagRepository
				.findByHashTagIdAndPostingPostTypeAndPostingObjectStatusAndPostingStatus(tagId,
						DocumentTypeEnum.COMMUNITY.getCode(), ObjectStatus.APPROVED.getCode(), "Active", pageable);
		List<Posting> postings = postingTags.stream()
				.map(PostingTag::getPosting)
				.filter(p -> "Active".equals(p.getStatus()))
				.distinct()
				.collect(Collectors.toList());
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		List<CommunityUser> communityUsers = communityUserRepository.findByUserDetailUserId(userId);
		List<CommunityPostingResponseDTO> result = userServiceHelper.generateCommunityPostingResponseDTO(postings,
				communityUsers);
		return result;
	}

	@Override
	public void updateWelcomeScreen(HttpServletRequest request) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		UserDetail userDetail = userRepository.findById(userId).get();
		userDetail.setWelcomeScreenShow(true);
		userRepository.save(userDetail);
	}

	@Override
	public java.util.List<com.simtech.dto.EmailSuggestionDTO> searchUsersByEmail(String query) {
		if (query == null || query.trim().isEmpty()) return java.util.Collections.emptyList();

		String qLower = query.trim().toLowerCase();

		org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0, 50);
		java.util.List<com.simtech.entity.UserDetail> users = userRepository.findAll(pageable).getContent();

		java.util.List<com.simtech.dto.EmailSuggestionDTO> result = new java.util.ArrayList<>();

		for (com.simtech.entity.UserDetail u : users) {
			try {
				String decryptedEmail = encryptDecryptUtil.decrypt(u.getEmailId());
				if (decryptedEmail != null && decryptedEmail.toLowerCase().contains(qLower)) {
					String fullName = (u.getFirstName() != null ? u.getFirstName() : "") + " " + (u.getLastName() != null ? u.getLastName() : "").trim();
					result.add(new com.simtech.dto.EmailSuggestionDTO(u.getUserId(), decryptedEmail, fullName.trim()));
					if (result.size() >= 10) break; // limit suggestions
				}
			} catch (Exception ignore) {}
		}

		return result;
	}

	@Override
	@Transactional
	public void updateProfilePhoto(HttpServletRequest request, ProfilePhotoDTO profilePhotoDTO) {
		Long userId = profilePhotoDTO.getUserId() != null ? profilePhotoDTO.getUserId()
				: Long.valueOf(request.getAttribute("userId").toString());

		UserDetail userDetail = userRepository.findById(userId)
				.orElseThrow(() -> new com.simtech.exception.BusinessException("userNotFound"));

		userDetail.setProfilePhoto(profilePhotoDTO.getProfilePhoto());
		userRepository.save(userDetail);
	}

	@Override
	public java.util.List<com.simtech.dto.EmailSuggestionDTO> searchUsersByName(String query) {
		if (query == null || query.trim().isEmpty()) return java.util.Collections.emptyList();

		String qLower = query.trim().toLowerCase();

		org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0, 50);
		java.util.List<com.simtech.entity.UserDetail> users = userRepository.findAll(pageable).getContent();

		java.util.List<com.simtech.dto.EmailSuggestionDTO> result = new java.util.ArrayList<>();

		for (com.simtech.entity.UserDetail u : users) {
			String fullName = ((u.getFirstName()!=null?u.getFirstName():"") + " " + (u.getLastName()!=null?u.getLastName():"")).trim();
			if (!fullName.isEmpty() && fullName.toLowerCase().contains(qLower)) {
				String emailDec;
				try { emailDec = encryptDecryptUtil.decrypt(u.getEmailId()); }
				catch (Exception e){ emailDec = null; }
				result.add(new com.simtech.dto.EmailSuggestionDTO(u.getUserId(), emailDec, fullName));
				if (result.size() >= 10) break;
			}
		}

		return result;
	}
}