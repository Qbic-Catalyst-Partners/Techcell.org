package com.simtech.service.helper;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simtech.constants.ApplicationConstants;
import com.simtech.dao.ProjectTeamRepository;
import com.simtech.dao.PostingRepository;
import com.simtech.dao.UserfavouritePostingRepository;
import com.simtech.dao.OrgDetailRepository;
import com.simtech.dto.CareerResponseDTO;
import com.simtech.dto.CertificationResponseDTO;
import com.simtech.dto.CommunityPostingResponseDTO;
import com.simtech.dto.CommunityUserDTO;
import com.simtech.dto.CommunityUserResponseDTO;
import com.simtech.dto.ContactRequestDTO;
import com.simtech.dto.HashTagResponseDTO;
import com.simtech.dto.InternshipResponseDTO;
import com.simtech.dto.JobResponseDTO;
import com.simtech.dto.LikePostRequestDTO;
import com.simtech.dto.PostBlogResponseDTO;
import com.simtech.dto.PostCommunityResponseDTO;
import com.simtech.dto.PostFeedResponseDTO;
import com.simtech.dto.PostSoftwareResponseDTO;
import com.simtech.dto.PostVideoResponseDTO;
import com.simtech.dto.PostingCommentResponseDTO;
import com.simtech.dto.PostingResponseDTO;
import com.simtech.dto.ProjectResponseDTO;
import com.simtech.dto.UsedAccessDTO;
import com.simtech.dto.UserCreateDTO;
import com.simtech.dto.UserDetailResponseDTO;
import com.simtech.dto.UserDetailShortResponseDTO;
import com.simtech.dto.UserUpdateDTO;
import com.simtech.dto.constant.DocumentTypeEnum;
import com.simtech.entity.Blog;
import com.simtech.entity.Career;
import com.simtech.entity.CareerTag;
import com.simtech.entity.CareerUser;
import com.simtech.entity.Certification;
import com.simtech.entity.Community;
import com.simtech.entity.CommunityUser;
import com.simtech.entity.ContactUs;
import com.simtech.entity.Feed;
import com.simtech.entity.HashTag;
import com.simtech.entity.Internship;
import com.simtech.entity.Job;
import com.simtech.entity.OTP;
import com.simtech.entity.OrgDetail;
import com.simtech.entity.Posting;
import com.simtech.entity.PostingComment;
import com.simtech.entity.PostingLike;
import com.simtech.entity.Project;
import com.simtech.entity.SecurityQuestion;
import com.simtech.entity.Software;
import com.simtech.entity.SoftwareTag;
import com.simtech.entity.UserDetail;
import com.simtech.entity.UserSignin;
import com.simtech.entity.UserfavouritePosting;
import com.simtech.entity.UserfavouriteTag;
import com.simtech.entity.Video;
import com.simtech.service.EmailService;
import com.simtech.service.EmailTemplateService;
import com.simtech.service.SMSService;
import com.simtech.service.impl.UserServiceImpl;
import com.simtech.util.AuthTokenUtil;
import com.simtech.util.EncryptDecryptUtil;

@Component
public class UserServiceHelper {

	@Autowired
	EmailService emailService;

	@Autowired
	SMSService smsService;

	@Autowired
	EncryptDecryptUtil encryptDecryptUtil;

	@Autowired
	OrgDetailRepository orgDetailRepository;

	@Autowired
	private ProjectTeamRepository projectTeamRepository;

	@Autowired
	EmailTemplateService emailTemplateService;

	@Autowired
	private PostingRepository postingRepository;

	@Autowired
	UserfavouritePostingRepository userfavouritePostingRepository;

	private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

	public UserDetail generateUserObjForCreate(UserCreateDTO userCreateDTO) {
		UserDetail userDetail = new UserDetail();
		userDetail.setFirstName(userCreateDTO.getFirstName());
		userDetail.setLastName(userCreateDTO.getLastName());
		userDetail.setMobileNo(encryptDecryptUtil.encrypt(userCreateDTO.getMobileNo()));
		userDetail.setEmailId(encryptDecryptUtil.encrypt(userCreateDTO.getEmailId()));
		if (userCreateDTO.getOrgId() != null) {
			userDetail.setOrgDetail(new OrgDetail(userCreateDTO.getOrgId()));
		} else if ("Corporate".equalsIgnoreCase(userCreateDTO.getRole())) {
			OrgDetail org = new OrgDetail();
			org.setOrgName(userCreateDTO.getOrgName());
			org.setCin(userCreateDTO.getCin());
			org.setGstNumber(userCreateDTO.getGstNumber());
			org.setCompanyEmail(userCreateDTO.getCompanyEmail());
			org.setContactNo(userCreateDTO.getCompanyPhoneNumber());
			org.setOrgAddress(userCreateDTO.getOrgAddress());
			org.setCity(userCreateDTO.getCity());
			org.setState(userCreateDTO.getState());
			org.setPincode(userCreateDTO.getPincode());
			org.setWebsite(userCreateDTO.getWebsite());
			org.setIndustryType(userCreateDTO.getIndustryType());
			org.setCompanySize(userCreateDTO.getCompanySize());
			org.setYearOfIncorporation(userCreateDTO.getYearOfIncorporation());
			org.setLogo(userCreateDTO.getLogo());
			org.setMcaRocVerified(userCreateDTO.getMcaRocVerified());
			org.setRegistrationId(userCreateDTO.getRegistrationId());
			org = orgDetailRepository.save(org);
			userDetail.setOrgDetail(org);
		}
		userDetail.setRole(userCreateDTO.getRole());
		userDetail.setCourseLevel(userCreateDTO.getCourseLevel());
		userDetail.setDob(userCreateDTO.getDob());
		userDetail.setGender(userCreateDTO.getGender());
		userDetail.setEffectiveDate(
				userCreateDTO.getEffectiveDate() == null ? new Date() : userCreateDTO.getEffectiveDate());
		userDetail.setGraduationCompletiondate(userCreateDTO.getGraduationCompletiondate());
		userDetail.setProgramName(userCreateDTO.getProgramName());
		userDetail.setIdNumber(
				userCreateDTO.getStudentId() != null ? userCreateDTO.getStudentId() : userCreateDTO.getFacultyId());
		userDetail.setStream(userCreateDTO.getStream());
		userDetail.setSecurityQuestion(new SecurityQuestion(userCreateDTO.getQuestionId()));
		userDetail.setSecurityAns(userCreateDTO.getSecurityQuestionAns());
		userDetail.setIdProof(userCreateDTO.getIdProof());
		if ("Corporate".equalsIgnoreCase(userCreateDTO.getRole())) {
			// Use company logo as profile photo for corporate users to keep UI consistent
			userDetail.setProfilePhoto(userCreateDTO.getLogo() != null ? userCreateDTO.getLogo()
					: userCreateDTO.getProfilePhoto());
		} else {
			userDetail.setProfilePhoto(userCreateDTO.getProfilePhoto());
		}
		if ("Corporate".equalsIgnoreCase(userCreateDTO.getRole())) {
			userDetail.setStatus("InActive");
		} else {
			userDetail.setStatus("Active");
		}
		userDetail.setDesignation(userCreateDTO.getDesignation());
		userDetail.setQualification(userCreateDTO.getQualification());
		userDetail.setDomailExp(userCreateDTO.getDomailExp());
		userDetail.setCurrentCompany(userCreateDTO.getCurrentCompany());
		userDetail.setWorkExp(userCreateDTO.getWorkExp());
		userDetail.setLinkedinProfile(userCreateDTO.getLinkedinProfile());
		userDetail.setPaymentReceived(!"Student".equalsIgnoreCase(userCreateDTO.getRole())); // remains true for Corporate
		userDetail.setCity(userCreateDTO.getCity());
		userDetail.setState(userCreateDTO.getState());
		userDetail.setDescription(userCreateDTO.getDescription());
		return userDetail;
	}

	public UserDetailResponseDTO generateUserDetailResponseDTO(UserDetail userDetail) {
		UserDetailResponseDTO detailResponseDTO = new UserDetailResponseDTO();
		detailResponseDTO.setUserId(userDetail.getUserId());
		detailResponseDTO.setFirstName(userDetail.getFirstName());
		detailResponseDTO.setLastName(userDetail.getLastName());
		detailResponseDTO.setMobileNo(encryptDecryptUtil.decrypt(userDetail.getMobileNo()));
		detailResponseDTO.setEmailId(encryptDecryptUtil.decrypt(userDetail.getEmailId()));
		if (userDetail.getOrgDetail() != null) {
			detailResponseDTO.setOrgId(userDetail.getOrgDetail().getOrgId());
		}
		detailResponseDTO.setRole(userDetail.getRole());
		detailResponseDTO.setCourseLevel(userDetail.getCourseLevel());
		detailResponseDTO.setDob(userDetail.getDob());
		detailResponseDTO.setGender(userDetail.getGender());
		detailResponseDTO
				.setEffectiveDate(userDetail.getEffectiveDate() == null ? new Date() : userDetail.getEffectiveDate());
		detailResponseDTO.setGraduationCompletiondate(userDetail.getGraduationCompletiondate());
		detailResponseDTO.setProgramName(userDetail.getProgramName());
		detailResponseDTO.setStudentId(userDetail.getRole().equalsIgnoreCase("Student") ? userDetail.getIdNumber() : null);
		detailResponseDTO.setFacultyId(userDetail.getRole().equalsIgnoreCase("Faculty") ? userDetail.getIdNumber() : null);
		detailResponseDTO.setStream(userDetail.getStream());
		detailResponseDTO.setStatus(userDetail.getStatus());
		detailResponseDTO.setProfilePhoto(userDetail.getProfilePhoto());
		detailResponseDTO.setSecurityQuestion(userDetail.getSecurityQuestion());
		detailResponseDTO.setSecurityAns(userDetail.getSecurityAns());
		detailResponseDTO.setOtpVerified(userDetail.isOtpVerified());
		detailResponseDTO.setDesignation(userDetail.getDesignation());
		detailResponseDTO.setQualification(userDetail.getQualification());
		detailResponseDTO.setDomailExp(userDetail.getDomailExp());
		detailResponseDTO.setCurrentCompany(userDetail.getCurrentCompany());
		detailResponseDTO.setWorkExp(userDetail.getWorkExp());
		detailResponseDTO.setLinkedinProfile(userDetail.getLinkedinProfile());
		detailResponseDTO.setCity(userDetail.getCity());
		detailResponseDTO.setState(userDetail.getState());
		detailResponseDTO.setDescription(userDetail.getDescription());
		detailResponseDTO.setPaymentReceived(userDetail.isPaymentReceived());
		detailResponseDTO.setWelcomeScreenShow(userDetail.isWelcomeScreenShow());
		return detailResponseDTO;
	}

	public UserDetailResponseDTO generateUserDetailListResponseDTO(UserDetail userDetail) {
		UserDetailResponseDTO userDetailResponseDTO = generateUserDetailResponseDTO(userDetail);
		OrgDetail orgDetail = userDetail.getOrgDetail();
		if (orgDetail != null) {
			userDetailResponseDTO.setOrgName(orgDetail.getOrgName());
			userDetailResponseDTO.setOrgAICTECode(orgDetail.getAICTECode());
		}
		return userDetailResponseDTO;
	}

	public UserDetailShortResponseDTO generateUserDetailShortResponseDTO(UserDetail userDetail) {
		UserDetailShortResponseDTO detailResponseDTO = new UserDetailShortResponseDTO();
		detailResponseDTO.setUserId(userDetail.getUserId());
		detailResponseDTO.setFirstName(userDetail.getFirstName());
		detailResponseDTO.setLastName(userDetail.getLastName());
		detailResponseDTO.setProfilePhoto(userDetail.getProfilePhoto());
		detailResponseDTO.setRole(userDetail.getRole());
		return detailResponseDTO;
	}

	public CommunityUserDTO generateCommunityUserDetail(UserDetail userDetail, Date joinedDate) {
		CommunityUserDTO detailResponseDTO = new CommunityUserDTO();
		detailResponseDTO.setUserId(userDetail.getUserId());
		detailResponseDTO.setFirstName(userDetail.getFirstName());
		detailResponseDTO.setLastName(userDetail.getLastName());
		detailResponseDTO.setProfilePhoto(userDetail.getProfilePhoto());
		detailResponseDTO.setRole(userDetail.getRole());
		detailResponseDTO.setJoinedDate(joinedDate);
		return detailResponseDTO;
	}

	public List<UserDetailShortResponseDTO> generateUserDetailShortResponseDTO(List<UserDetail> userDetails) {
		List<UserDetailShortResponseDTO> targetList = userDetails.stream().map(userDetail -> {
			return generateUserDetailShortResponseDTO(userDetail);
		}).collect(Collectors.toList());
		return targetList;
	}

	public UserDetail generateUserObjForUpdate(UserDetail userDetail, UserUpdateDTO userUpdateDTO) {
		if (userUpdateDTO.getFirstName() != null) {
			userDetail.setFirstName(userUpdateDTO.getFirstName());
		}
		if (userUpdateDTO.getLastName() != null) {
			userDetail.setLastName(userUpdateDTO.getLastName());
		}
		if (userUpdateDTO.getMobileNo() != null) {
			userDetail.setMobileNo(encryptDecryptUtil.encrypt(userUpdateDTO.getMobileNo()));
		}
		if (userUpdateDTO.getEmailId() != null) {
			userDetail.setEmailId(encryptDecryptUtil.encrypt(userUpdateDTO.getEmailId()));
		}
		if (userUpdateDTO.getCourseLevel() != null) {
			userDetail.setCourseLevel(userUpdateDTO.getCourseLevel());
		}
		if (userUpdateDTO.getDob() != null) {
			userDetail.setDob(userUpdateDTO.getDob());
		}
		if (userUpdateDTO.getGender() != null) {
			userDetail.setGender(userUpdateDTO.getGender());
		}
		userDetail.setEffectiveDate(
				userUpdateDTO.getEffectiveDate() == null ? new Date() : userUpdateDTO.getEffectiveDate());
		if (userUpdateDTO.getGraduationCompletiondate() != null) {
			userDetail.setGraduationCompletiondate(userUpdateDTO.getGraduationCompletiondate());
		}
		if (userUpdateDTO.getProgramName() != null) {
			userDetail.setProgramName(userUpdateDTO.getProgramName());
		}
		if (userUpdateDTO.getStudentId() != null) {
			userDetail.setIdNumber(userUpdateDTO.getStudentId());
		}
		if (userUpdateDTO.getFacultyId() != null) {
			userDetail.setIdNumber(userUpdateDTO.getFacultyId());
		}
		if (userUpdateDTO.getStream() != null) {
			userDetail.setStream(userUpdateDTO.getStream());
		}
		if (userUpdateDTO.getQuestionId() != null) {
			userDetail.setSecurityQuestion(new SecurityQuestion(userUpdateDTO.getQuestionId()));
		}
		if (userUpdateDTO.getSecurityQuestionAns() != null) {
			userDetail.setSecurityAns(userUpdateDTO.getSecurityQuestionAns());
		}
		if (userUpdateDTO.getIdProof() != null && userUpdateDTO.getIdProof().length > 0) {
			userDetail.setIdProof(userUpdateDTO.getIdProof());
		}
		if (userUpdateDTO.getProfilePhoto() != null && userUpdateDTO.getProfilePhoto().length > 0) {
			userDetail.setProfilePhoto(userUpdateDTO.getProfilePhoto());
		}
		if (userUpdateDTO.getDesignation() != null) {
			userDetail.setDesignation(userUpdateDTO.getDesignation());
		}
		if (userUpdateDTO.getQualification() != null) {
			userDetail.setQualification(userUpdateDTO.getQualification());
		}
		if (userUpdateDTO.getDomailExp() != null) {
			userDetail.setDomailExp(userUpdateDTO.getDomailExp());
		}
		if (userUpdateDTO.getCurrentCompany() != null) {
			userDetail.setCurrentCompany(userUpdateDTO.getCurrentCompany());
		}
		if (userUpdateDTO.getWorkExp() != null) {
			userDetail.setWorkExp(userUpdateDTO.getWorkExp());
		}
		if (userUpdateDTO.getLinkedinProfile() != null) {
			userDetail.setLinkedinProfile(userUpdateDTO.getLinkedinProfile());
		}
		if (userUpdateDTO.getCity() != null) {
			userDetail.setCity(userUpdateDTO.getCity());
		}
		if (userUpdateDTO.getState() != null) {
			userDetail.setState(userUpdateDTO.getState());
		}
		if (userUpdateDTO.getDescription() != null) {
			userDetail.setDescription(userUpdateDTO.getDescription());
		}
		if (userUpdateDTO.getStatus() != null) {
			userDetail.setStatus(userUpdateDTO.getStatus());
		}
		return userDetail;
	}

	public UserSignin generateUserSignIn(UserDetail userDetail, UserCreateDTO usCreateDTO) {
		UserSignin userSignin = new UserSignin();
		userSignin.setUserName(usCreateDTO.getEmailId());
		userSignin.setPassword(encryptDecryptUtil.encrypt(usCreateDTO.getPassword()));
		userSignin.setUserDetail(userDetail);
		return userSignin;
	}

	public boolean verifyPassword(String inputPassword, String storedPassword) {
		return encryptDecryptUtil.decrypt(storedPassword).equals(inputPassword);
	}

	public void sendContactNotification(String category, String subject, String message, UserDetail userDetail) {
		String userName = userDetail.getFirstName() + " " + userDetail.getLastName();
		String userEmail = encryptDecryptUtil.decrypt(userDetail.getEmailId());
		String userRole = userDetail.getRole();

		String emailTemplate = "New Contact Request from TechCell Platform\n\n"
				+ "Category: " + category + "\n"
				+ "Subject: " + subject + "\n\n"
				+ "Message:\n" + message + "\n\n"
				+ "User Details:\n"
				+ "Name: " + userName + "\n"
				+ "Email: " + userEmail + "\n"
				+ "Role: " + userRole + "\n\n"
				+ "This message was submitted via the TechCell platform's contact form.\n"
				+ "Please respond to the user directly at their email address.";

		emailService.sendSimpleEmail("contact@techcell.org", "Contact Form: " + category + " - " + subject, emailTemplate);
	}

	public void sendEmailForOTP(String emailId, String userName,String otp) {
		String emailContent = String.format(
				"Dear %s,\n\n" +
						"Thank you for signing up with TechCell! To complete your login process, please enter the OTP below:\n\n" +
						"OTP: %s\n\n" +
						"Instructions:\n\n" +
						"1. Copy the OTP above.\n\n" +
						"2. Enter it in the verification field on our app.\n\n" +
						"3. Click \"Verify\" to complete the process.\n\n" +
						"Note: Your OTP is valid for 10 minutes. If you don't verify within this time, please request a new OTP.\n\n" +
						"If you have any questions or need assistance, please get in touch with our support team at contact@techcell.org\n\n" +
						"Thank you for choosing TechCell!\n\n" +
						"Best regards,\n\n" +
						"The TechCell Team",
				userName, otp
		);
		emailService.sendSimpleEmail(emailId, "OTP for signin", emailContent);

	}

	public void sendRegisterOTP(String emailId, String name, String otp) {
		String emailTemplate = "Dear " + name + ",\n\n"
				+ "Thank you for signing up with TechCell! To complete your registration, please verify your email address by entering the OTP below:\n\n"
				+ "OTP: " + otp + "\n\n" + "Instructions:\n" + "1. Copy the OTP above.\n"
				+ "2. Enter it in the verification field on our app.\n"
				+ "3. Click \"Verify\" to complete the process.\n\n"
				+ "Note: Your OTP is valid for 10 minutes. If you don't verify within this time, you can request a new OTP.\n\n"
				+ "If you have any questions or need assistance, our support team is here to help at contact@techcell.org.\n\n"
				+ "Thank you for choosing TechCell!\n\n" + "Best regards,\n" + "The TechCell Team";
		emailService.sendSimpleEmail(emailId, "Verify Your Email Address with OTP", emailTemplate);

	}

	public String generateOTP() {
		// Generate a random number between 100000 (inclusive) and 999999 (inclusive)
		int otpValue = new Random().nextInt(900000) + 100000;
		// for Testing
//		otpValue = 111111;
		return String.valueOf(otpValue);
	}

	public OTP generateOTPObj(UserDetail userDetail, String emailId, String otp, String reason) {
		OTP otpObj = new OTP();
		Date currentDate = new Date();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(currentDate);
		calendar.add(Calendar.MINUTE, ApplicationConstants.OTPEXPIRYTIME);
		Date expiryTime = calendar.getTime();
		otpObj.setCreatedTime(currentDate);
		otpObj.setExpiryTime(expiryTime);
		otpObj.setIsVerified(false);
		otpObj.setOtpCode(otp);
		otpObj.setReason(reason);
		otpObj.setSource(emailId != null ? "Email" : "SMS");
		otpObj.setUserDetail(userDetail);
		return otpObj;
	}

	public String generateToken(UserSignin existingRecord) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("userId", existingRecord.getUserDetail().getUserId());
		if (existingRecord.getUserDetail().getOrgDetail() != null) {
			claims.put("orgId", existingRecord.getUserDetail().getOrgDetail().getOrgId());
		} else {
			claims.put("orgId", 0);
		}
		claims.put("role", existingRecord.getUserDetail().getRole());
		String token = AuthTokenUtil.generateToken("MySubject", claims, false);
		return token;
	}

	public String generateRefreshToken(UserSignin existingRecord) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("userId", existingRecord.getUserDetail().getUserId());
		if (existingRecord.getUserDetail().getOrgDetail() != null) {
			claims.put("orgId", existingRecord.getUserDetail().getOrgDetail().getOrgId());
		} else {
			claims.put("orgId", 0);
		}
		claims.put("role", existingRecord.getUserDetail().getRole());
		String token = AuthTokenUtil.generateToken("MySubject", claims, true);
		return token;
	}

	public OTP sendRegisterEmailOTP(UserDetail userDetail, String EmailId) {
		String emailotp = generateOTP();
		OTP otp = generateOTPObj(userDetail, EmailId, emailotp, "Verification");
		sendRegisterOTP(EmailId, userDetail.getFirstName(), emailotp);
		return otp;
	}

	public void sendSMSOTP(UserDetail userDetail) {
		smsService.sendotp("+91" + encryptDecryptUtil.decrypt(userDetail.getMobileNo()));
	}

	public List<PostingResponseDTO> generatePostingResponseDTOs(List<Posting> postings) {

		List<PostingResponseDTO> targetList = postings.stream().map(source -> {
			return generatePostingResponseDTO(source);
		}).collect(Collectors.toList());
		return targetList;
	}

	public PostingResponseDTO generatePostingResponseDTO(Posting source) {
		PostingResponseDTO postingResponseDTO = new PostingResponseDTO();
		postingResponseDTO.setComments(source.getComments());
		postingResponseDTO.setCreatedDate(source.getCreatedDate());
		postingResponseDTO.setUpdateddDate(source.getUpdateddDate());
		postingResponseDTO.setLikes(source.getLikes());
		postingResponseDTO.setPostedUser(generateUserDetailShortResponseDTO(source.getPostedUser()));
		postingResponseDTO.setPostingId(source.getId());
		postingResponseDTO.setPostType(source.getPostType());
		postingResponseDTO.setShortDescription(source.getShortDescription());
		postingResponseDTO.setTitle(source.getTitle());
		if (DocumentTypeEnum.VIDEOS.getCode().equals(source.getPostType())) {
			Video video = source.getVideo();
			postingResponseDTO.setVideo(new PostVideoResponseDTO(video.getId(), video.getDescription(),
					video.getVideoLink(), video.getVideoData()));
		}
		if (DocumentTypeEnum.BLOGS.getCode().equals(source.getPostType())) {
			Blog blog = source.getBlog();
			postingResponseDTO.setBlog(new PostBlogResponseDTO(blog.getId(), blog.getDescription(),
					blog.getBlogContent(), blog.getThumbnail()));
		}
		if (DocumentTypeEnum.parseEncodeValue(source.getPostType()) == DocumentTypeEnum.COMMUNITY) {
			Community community = source.getCommunity();
			postingResponseDTO.setCommunity(new PostCommunityResponseDTO(community.getId(), community.getTitle(),
					community.getDescription(), community.getProfilePhoto(), community.getCoverPhoto(),
					community.getCreatedDate(), community.getMemberCount()));
			if (source.getModerator() != null) {
				postingResponseDTO.setModerator(generateUserDetailShortResponseDTO(source.getModerator()));
			}
		}
		if (DocumentTypeEnum.parseEncodeValue(source.getPostType()) == DocumentTypeEnum.FEED) {
			Feed feed = source.getFeed();
			PostingResponseDTO content = null;
			if (feed.getContentPosting() != null) {
				content = generatePostingResponseDTO(feed.getContentPosting());
			}
			postingResponseDTO.setFeed(new PostFeedResponseDTO(feed.getId(), feed.getDescription(), content));
		}

		postingResponseDTO.setViews(source.getViews());
		// Set favourite count via repository
		Long favCount = userfavouritePostingRepository.countByPostingIdAndIsFavouriteTrue(source.getId());
		postingResponseDTO.setFavouriteCount(favCount);
		postingResponseDTO.setStatus(source.getStatus());
		postingResponseDTO.setPostingTags(setHashTag(source));
		return postingResponseDTO;
	}

	private List<HashTagResponseDTO> setHashTag(Posting source) {
		List<HashTagResponseDTO> targetList = new ArrayList<HashTagResponseDTO>();
		if (source.getPostingTags() != null) {
			targetList = source.getPostingTags().stream().map(posstingTag -> {
				HashTagResponseDTO hashTagResponseDTO = new HashTagResponseDTO();
				hashTagResponseDTO.setHashTag(posstingTag.getHashTag());
				hashTagResponseDTO.setIsPrimary(posstingTag.getIsPrimary());
				return hashTagResponseDTO;
			}).collect(Collectors.toList());

		}
		return targetList;

	}

	public UserfavouritePosting generateUserfavouritePosting(Long orgId, Long userId, Long postingId,
															 boolean isFavourite) {
		UserfavouritePosting userfavouritePosting = new UserfavouritePosting();
		userfavouritePosting.setEffectiveDate(new Date());
		userfavouritePosting.setPosting(new Posting(postingId));
		userfavouritePosting.setUserId(userId);
		userfavouritePosting.setFavourite(isFavourite);

		return userfavouritePosting;
	}

	public UserfavouriteTag generateUserfavouriteTag(Long orgId, Long userId, HashTag HashTag) {
		UserfavouriteTag userfavouriteTag = new UserfavouriteTag();
		userfavouriteTag.setEffectiveDate(new Date());
		userfavouriteTag.setOrgId(orgId);
		userfavouriteTag.setHashTag(HashTag);
		userfavouriteTag.setUserId(userId);

		return userfavouriteTag;
	}

	public List<PostingResponseDTO> generatePostingResponseDTOForFav(List<UserfavouritePosting> userfavouritePostings) {
		List<PostingResponseDTO> postingResponseDTOs = new ArrayList<PostingResponseDTO>();
		if (userfavouritePostings != null) {
			List<Posting> postingList = userfavouritePostings.stream().map(source -> {
				return source.getPosting();
			}).collect(Collectors.toList());
			postingResponseDTOs = generatePostingResponseDTOs(postingList);
		}
		return postingResponseDTOs;
	}

	public List<UsedAccessDTO> generateUsedAccessDTO(Map<String, Boolean> roleAccessmap) {
		List<UsedAccessDTO> result = new ArrayList<>();
		for (Map.Entry<String, Boolean> entry : roleAccessmap.entrySet()) {
			String accessName = entry.getKey();
			boolean hasAccess = entry.getValue();
			UsedAccessDTO dto = new UsedAccessDTO(accessName.split(ApplicationConstants.DELEMITER)[0],
					accessName.split(ApplicationConstants.DELEMITER)[1], hasAccess);
			result.add(dto);
		}
		return result;
	}

	public PostingLike generatePostingLike(PostingLike postingLike, Long orgId, Long userId,
										   LikePostRequestDTO likePostRequestDTO) {
		if (postingLike == null) {
			postingLike = new PostingLike();
			postingLike.setOrgId(orgId);
			postingLike.setPosting(new Posting(likePostRequestDTO.getPostingId()));
			postingLike.setUserDetail(new UserDetail(userId));
		}
		postingLike.setIsLike(likePostRequestDTO.isLike());
		postingLike.setUpdatedDate(new Date());
		return postingLike;
	}

	public void setLikeFavouriteInPostingResponseDTO(List<PostingResponseDTO> result, List<PostingLike> likes,
													 List<UserfavouritePosting> userFavouritePosting, List<CommunityUser> communityUsers) {

		for (PostingResponseDTO postingResponseDTO : result) {
			// Check if there is a like for this postingResponseDTO
			boolean isLiked = likes.stream().anyMatch(
					like -> like.getPosting().getId().equals(postingResponseDTO.getPostingId()) && like.getIsLike());
			if (userFavouritePosting != null) {
				boolean isFavourite = userFavouritePosting.stream()
						.anyMatch(favourite -> favourite.getPosting().getId().equals(postingResponseDTO.getPostingId())
								&& favourite.isFavourite());
				postingResponseDTO.setFavoured(isFavourite);
			}
			if (communityUsers != null
					&& postingResponseDTO.getPostType().equals(DocumentTypeEnum.COMMUNITY.getCode())) {
				boolean isActiveMember = communityUsers.stream().anyMatch(communityUser -> communityUser.getCommunity()
						.getId() == postingResponseDTO.getCommunity().getId());
				postingResponseDTO.getCommunity().setActive(isActiveMember);
			}

			// Set the like status in the PostingResponseDTO
			postingResponseDTO.setLiked(isLiked);

		}

	}

	public Set<HashTag> generateHashTagForFav(List<UserfavouriteTag> userfavouriteTags) {
		return userfavouriteTags.stream().map(source -> {
			return source.getHashTag();
		}).collect(Collectors.toSet());
	}

	public PostingComment generatePostingComment(Long orgId, Long userId, Long postingId, String content,
												 Long parentCommentId) {
		PostingComment postingComment = new PostingComment();
		postingComment.setCommentTime(new Date());
		postingComment.setUpdateTime(new Date());
		postingComment.setOrgId(orgId);
		postingComment.setPosting(new Posting(postingId));
		postingComment.setUserDetail(new UserDetail(userId));
		postingComment.setContent(content);
		postingComment.setParentCommentId(parentCommentId);
		return postingComment;
	}

	public List<PostingCommentResponseDTO> PostingCommentResponse(List<PostingComment> postingComments) {
		List<PostingCommentResponseDTO> targetList = postingComments.stream().map(source -> {
			PostingCommentResponseDTO postingCommentResponseDTO = new PostingCommentResponseDTO();
			postingCommentResponseDTO.setCommentTime(source.getCommentTime());
			postingCommentResponseDTO.setContent(source.getContent());
			postingCommentResponseDTO.setCommentedUser(generateUserDetailShortResponseDTO(source.getUserDetail()));
			postingCommentResponseDTO.setCommentId(source.getId());
			postingCommentResponseDTO.setParentCommentId(source.getParentCommentId());
			postingCommentResponseDTO.setReplyCount(source.getReplyCount());
			return postingCommentResponseDTO;
		}).collect(Collectors.toList());
		return targetList;
	}

	public List<CommunityPostingResponseDTO> generateCommunityPostingResponseDTO(List<Posting> postings,
																				 List<CommunityUser> communityUsers) {
		List<CommunityPostingResponseDTO> targetList = postings.stream().map(source -> {
			return generateCommunityResponseDTO(source, communityUsers);
		}).collect(Collectors.toList());
		return targetList;
	}

	public CommunityPostingResponseDTO generateCommunityResponseDTO(Posting source,
																	List<CommunityUser> communityUsers) {
		CommunityPostingResponseDTO postingResponseDTO = new CommunityPostingResponseDTO();
		postingResponseDTO.setComments(source.getComments());
		postingResponseDTO.setCreatedDate(source.getCreatedDate());
		postingResponseDTO.setUpdateddDate(source.getUpdateddDate());
		postingResponseDTO.setLikes(source.getLikes());
		postingResponseDTO.setPostedUser(generateUserDetailShortResponseDTO(source.getPostedUser()));
		postingResponseDTO.setPostingId(source.getId());
		postingResponseDTO.setPostType(source.getPostType());
		postingResponseDTO.setShortDescription(source.getShortDescription());
		postingResponseDTO.setTitle(source.getTitle());
		postingResponseDTO.setStatus(source.getStatus());
		Community community = source.getCommunity();
		postingResponseDTO.setCommunity(new PostCommunityResponseDTO(community.getId(), community.getTitle(),
				community.getDescription(), community.getProfilePhoto(), community.getCoverPhoto(),
				community.getCreatedDate(), community.getMemberCount()));
		if (source.getModerator() != null) {
			postingResponseDTO.setModerator(generateUserDetailShortResponseDTO(source.getModerator()));
		}

		postingResponseDTO.setPostingTags(setHashTag(source));

		boolean isActiveMember = communityUsers.stream()
				.anyMatch(communityUser -> communityUser.getCommunity().getId().equals(community.getId()));
		postingResponseDTO.setJoined(isActiveMember);
		return postingResponseDTO;
	}

	public List<PostSoftwareResponseDTO> generatePostSoftwareResponseDTOs(List<Software> softwareList) {
		List<PostSoftwareResponseDTO> targetList = softwareList.stream().map(source -> {
			return generatePostSoftwareResponseDTO(source);
		}).collect(Collectors.toList());
		return targetList;
	}

	public List<PostSoftwareResponseDTO> generatePostSoftwareResponseDTOsByTag(List<SoftwareTag> softwaretagList) {
		List<PostSoftwareResponseDTO> targetList = softwaretagList.stream().map(source -> {
			return generatePostSoftwareResponseDTO(source.getSoftware());
		}).collect(Collectors.toList());
		return targetList;
	}

	private PostSoftwareResponseDTO generatePostSoftwareResponseDTO(Software source) {
		PostSoftwareResponseDTO postSoftwareResponseDTO = new PostSoftwareResponseDTO();
		postSoftwareResponseDTO.setId(source.getId());
		postSoftwareResponseDTO.setCreatedDate(source.getCreatedDate());
		postSoftwareResponseDTO.setUpdateddDate(source.getUpdateddDate());
		postSoftwareResponseDTO.setLicenceType(source.getLicenceType());
		postSoftwareResponseDTO.setOsSupported(source.getOsSupported());
		postSoftwareResponseDTO.setReleaseDate(source.getReleaseDate());
		postSoftwareResponseDTO.setSoftwarelink(source.getSoftwarelink());
		postSoftwareResponseDTO.setSoftwareName(source.getSoftwareName());
		postSoftwareResponseDTO.setThumbnail(source.getThumbnail());
		postSoftwareResponseDTO.setVersion(source.getVersion());
		postSoftwareResponseDTO.setStatus(source.getStatus());
		List<HashTagResponseDTO> hashTagResponseDTOs = getSoftwareHashTag(source);
		postSoftwareResponseDTO.setHashTagResponseDTOs(hashTagResponseDTOs);
		return postSoftwareResponseDTO;
	}

	private List<HashTagResponseDTO> getSoftwareHashTag(Software source) {
		List<HashTagResponseDTO> targetList = new ArrayList<HashTagResponseDTO>();
		if (source.getSoftwareTags() != null) {
			targetList = source.getSoftwareTags().stream().map(softwareTag -> {
				HashTagResponseDTO hashTagResponseDTO = new HashTagResponseDTO();
				hashTagResponseDTO.setHashTag(softwareTag.getHashTag());
				hashTagResponseDTO.setIsPrimary(softwareTag.getIsPrimary());
				return hashTagResponseDTO;
			}).collect(Collectors.toList());

		}
		return targetList;
	}

	public List<CommunityUserDTO> generateCommunityUserShortResponseDTO(List<CommunityUser> communityUsers) {
		List<CommunityUserDTO> targetList = communityUsers.stream().map(communityUser -> {
			return generateCommunityUserDetail(communityUser.getUserDetail(), communityUser.getCreatedDate());
		}).collect(Collectors.toList());
		return targetList;
	}

	public List<CommunityUserResponseDTO> generateCommunityUserResponseDTO(List<CommunityUser> communityUsers) {
		List<CommunityUserResponseDTO> targetList = new ArrayList<CommunityUserResponseDTO>();
		targetList = communityUsers.stream().map(CommunityUser -> {
			CommunityUserResponseDTO communityUserResponseDTO = new CommunityUserResponseDTO();
			Community community = CommunityUser.getCommunity();
			communityUserResponseDTO.setPostCommunityResponseDTO(new PostCommunityResponseDTO(community.getId(),
					community.getTitle(), community.getDescription(), community.getProfilePhoto(),
					community.getCoverPhoto(), community.getCreatedDate(), community.getMemberCount()));

			Posting posting = postingRepository.findByCommunityId(community.getId());
			if (posting != null) {
				communityUserResponseDTO.setPostingId(posting.getId());
			}
			communityUserResponseDTO.setJoinedDate(CommunityUser.getCreatedDate());
			return communityUserResponseDTO;
		}).collect(Collectors.toList());

		return targetList;
	}

	public List<InternshipResponseDTO> generateInternshipResponse(List<Internship> internships,
																  List<CareerUser> careerUsers, List<CareerUser> careerUsersApplied) {
		List<InternshipResponseDTO> targetList = new ArrayList<InternshipResponseDTO>();
		targetList = internships.stream().map(internship -> {
			return generateInternshipObj(internship, careerUsersApplied);
		}).collect(Collectors.toList());
		mapInternshipsApplied(targetList, careerUsers);
		return targetList;
	}

	private Long getCountByStatus(List<CareerUser> careerUsers, Long id, String status, DocumentTypeEnum type) {
		return careerUsers.stream().filter(
						careerUser -> careerUser.getStatus().equalsIgnoreCase(status) && isMatchingTypeAndId(careerUser, id, type))
				.count();
	}

	private boolean isMatchingTypeAndId(CareerUser careerUser, Long id, DocumentTypeEnum type) {
		switch (type) {
			case INTERNSHIP:
				if (careerUser.getCareer().getInternship() != null) {
					return careerUser.getCareer().getInternship().getId().equals(id);
				}
			case PROJECT:
				if (careerUser.getCareer().getProject() != null) {
					return careerUser.getCareer().getProject().getId().equals(id);
				}
			case JOB:
				if (careerUser.getCareer().getJob() != null) {
					return careerUser.getCareer().getJob().getId().equals(id);
				}
			case CERTIFICATION:
				if (careerUser.getCareer().getCertification() != null) {
					return careerUser.getCareer().getCertification().getId().equals(id);
				}
			default:
				return false;
		}
	}

	private InternshipResponseDTO generateInternshipObj(Internship internship, List<CareerUser> careerUsers) {
		InternshipResponseDTO internshipResponseDTO = new InternshipResponseDTO();
		internshipResponseDTO.setCompanyDesc(internship.getCompanyDesc());
		internshipResponseDTO.setCompanyLogo(internship.getCompanyLogo());
		internshipResponseDTO.setCompanyName(internship.getCompanyName());
		internshipResponseDTO.setContactNo(internship.getContactNo());
		internshipResponseDTO.setCoverPage(internship.getCoverPage());
		internshipResponseDTO.setCreatedDate(internship.getCreatedDate());
		internshipResponseDTO.setDesc(internship.getDesc());
		internshipResponseDTO.setDuration(internship.getDuration());
		internshipResponseDTO.setDurationUnit(internship.getDurationUnit());
		internshipResponseDTO.setEmail(internship.getEmail());
		internshipResponseDTO.setEndDate(internship.getEndDate());
		internshipResponseDTO.setInternshipId(internship.getId());
		internshipResponseDTO.setLocation(internship.getLocation());
		internshipResponseDTO.setQualification(internship.getQualification());
		internshipResponseDTO.setStartDate(internship.getStartDate());
		internshipResponseDTO.setStipend(internship.getStipend());
		internshipResponseDTO.setTitle(internship.getTitle());
		internshipResponseDTO.setUpdateddDate(internship.getUpdateddDate());
		internshipResponseDTO.setTags(setHashTag(internship.getCareerTags()));
		internshipResponseDTO.setSkills(internship.getSkills());
		internshipResponseDTO.setStatus(internship.getStatus());
		internshipResponseDTO.setReason(internship.getReason());
		if (careerUsers != null) {
			internshipResponseDTO.setAppliedCount(
					getCountByStatus(careerUsers, internship.getId(), "Applied", DocumentTypeEnum.INTERNSHIP));
			internshipResponseDTO.setSelectedCount(
					getCountByStatus(careerUsers, internship.getId(), "Accepted", DocumentTypeEnum.INTERNSHIP));
			internshipResponseDTO.setRejectedCount(
					getCountByStatus(careerUsers, internship.getId(), "Rejected", DocumentTypeEnum.INTERNSHIP));
		}
		return internshipResponseDTO;
	}

	private List<HashTagResponseDTO> setHashTag(List<CareerTag> careerTags) {
		List<HashTagResponseDTO> targetList = new ArrayList<HashTagResponseDTO>();
		targetList = careerTags.stream().map(careerTag -> {
			HashTagResponseDTO hashTagResponseDTO = new HashTagResponseDTO();
			hashTagResponseDTO.setHashTag(careerTag.getHashTag());
			hashTagResponseDTO.setIsPrimary(careerTag.getIsPrimary());
			return hashTagResponseDTO;
		}).collect(Collectors.toList());

		return targetList;

	}

	public List<JobResponseDTO> generateJobResponse(List<Job> jobs, List<CareerUser> careerUsers,
													List<CareerUser> careerUsersApplied) {
		List<JobResponseDTO> targetList = new ArrayList<JobResponseDTO>();
		targetList = jobs.stream().map(internship -> {
			return generateJobObj(internship, careerUsersApplied);
		}).collect(Collectors.toList());
		mapJobApplied(targetList, careerUsers);
		return targetList;
	}

	public List<ProjectResponseDTO> generateProjectResponse(List<Project> projects, List<CareerUser> careerUsers,
															List<CareerUser> careerUsersApplied) {
		List<ProjectResponseDTO> targetList = new ArrayList<ProjectResponseDTO>();
		targetList = projects.stream().map(internship -> {
			return generateProjectObj(internship, careerUsersApplied);
		}).collect(Collectors.toList());
		mapProjectApplied(targetList, careerUsers);
		return targetList;
	}

	private ProjectResponseDTO generateProjectObj(Project project, List<CareerUser> careerUsers) {
		ProjectResponseDTO projectResponseDTO = new ProjectResponseDTO();
		projectResponseDTO.setApplied(false);
		projectResponseDTO.setCompanyDesc(project.getCompanyDesc());
		projectResponseDTO.setCompanyLogo(project.getCompanyLogo());
		projectResponseDTO.setCompanyName(project.getCompanyName());
		projectResponseDTO.setContactNo(project.getContactNo());
		projectResponseDTO.setCoverPage(project.getCoverPage());
		projectResponseDTO.setCreatedBy(generateUserDetailShortResponseDTO(project.getCreatedBy()));
		projectResponseDTO.setCreatedDate(project.getCreatedDate());
		projectResponseDTO.setDesc(project.getDesc());
		projectResponseDTO.setEmail(project.getEmail());
		projectResponseDTO.setEndDate(project.getEndDate());
		projectResponseDTO.setId(project.getId());
		projectResponseDTO.setSkills(project.getSkills());
		projectResponseDTO.setStartDate(project.getStartDate());
		projectResponseDTO.setTags(setHashTag(project.getCareerTags()));
		projectResponseDTO.setTeamCount(project.getTeamCount());
		projectResponseDTO.setTeamSize(project.getTeamSize());
		projectResponseDTO.setTitle(project.getTitle());
		projectResponseDTO.setUpdatedDate(project.getUpdateddDate());
		projectResponseDTO.setStatus(project.getStatus());
		projectResponseDTO.setReason(project.getReason());
		projectResponseDTO.setDuration(project.getDuration());
		projectResponseDTO.setDurationUnit(project.getDurationUnit());

		// Application counts should now be based on team status, not individual career users
		long appliedTeams = projectTeamRepository.countByProject_IdAndStatus(project.getId(), "COMPLETE");
		long approvedTeams = projectTeamRepository.countByProject_IdAndStatus(project.getId(), "APPROVED");
		long rejectedTeams = projectTeamRepository.countByProject_IdAndStatus(project.getId(), "REJECTED");

		projectResponseDTO.setAppliedCount(appliedTeams);
		projectResponseDTO.setSelectedCount(approvedTeams);
		projectResponseDTO.setRejectedCount(rejectedTeams);

		return projectResponseDTO;
	}

	private JobResponseDTO generateJobObj(Job job, List<CareerUser> careerUsers) {
		JobResponseDTO jobResponseDTO = new JobResponseDTO();
		jobResponseDTO.setCompanyDesc(job.getCompanyDesc());
		jobResponseDTO.setCompanyLogo(job.getCompanyLogo());
		jobResponseDTO.setCompanyName(job.getCompanyName());
		jobResponseDTO.setContactNo(job.getContactNo());
		jobResponseDTO.setCoverPage(job.getCoverPage());
		jobResponseDTO.setCreatedDate(job.getCreatedDate());
		jobResponseDTO.setDesc(job.getDesc());
		jobResponseDTO.setExperiance(job.getExperiance());
		jobResponseDTO.setExperianceUnit(job.getExperianceUnit());
		jobResponseDTO.setEmail(job.getEmail());
		jobResponseDTO.setEndDate(job.getEndDate());
		jobResponseDTO.setJobId(job.getId());
		jobResponseDTO.setLocation(job.getLocation());
		jobResponseDTO.setQualification(job.getQualification());
		jobResponseDTO.setStartDate(job.getStartDate());
		jobResponseDTO.setCtc(job.getCtc());
		jobResponseDTO.setCtcTo(job.getCtcTo());
		jobResponseDTO.setDesignation(job.getDesignation());
		jobResponseDTO.setUpdatedDate(job.getUpdatedDate());
		jobResponseDTO.setTags(setHashTag(job.getCareerTags()));
		jobResponseDTO.setSkills(job.getSkills());
		jobResponseDTO.setJobType(job.getJobType());

		jobResponseDTO.setStatus(job.getStatus());
		jobResponseDTO.setReason(job.getReason());
		if (careerUsers != null) {
			jobResponseDTO.setAppliedCount(getCountByStatus(careerUsers, job.getId(), "Applied", DocumentTypeEnum.JOB));
			jobResponseDTO.setSelectedCount(getCountByStatus(careerUsers, job.getId(), "Accepted", DocumentTypeEnum.JOB));
			jobResponseDTO.setRejectedCount(
					getCountByStatus(careerUsers, job.getId(), "Rejected", DocumentTypeEnum.JOB));
		}
		return jobResponseDTO;
	}

	public void mapJobApplied(List<JobResponseDTO> result, List<CareerUser> careerUsers) {
		if (careerUsers != null) {
			for (JobResponseDTO jobResponseDTO : result) {
				boolean applied = careerUsers.stream().anyMatch(careerUser -> {
					return careerUser != null && careerUser.getCareer() != null
							&& careerUser.getCareer().getJob() != null
							&& careerUser.getCareer().getJob().getId().equals(jobResponseDTO.getJobId());
				});
				jobResponseDTO.setApplied(applied);
			}
		}
	}

	public void mapProjectApplied(List<ProjectResponseDTO> result, List<CareerUser> careerUsers) {
		if (careerUsers != null) {
			for (ProjectResponseDTO jobResponseDTO : result) {
				boolean applied = careerUsers.stream().anyMatch(careerUser -> {
					return careerUser != null && careerUser.getCareer() != null
							&& careerUser.getCareer().getProject() != null
							&& careerUser.getCareer().getProject().getId() == jobResponseDTO.getId();
				});
				jobResponseDTO.setApplied(applied);
			}
		}
	}

	public void mapInternshipsApplied(List<InternshipResponseDTO> result, List<CareerUser> careerUsers) {
		if (careerUsers != null) {
			for (InternshipResponseDTO jobResponseDTO : result) {
				boolean applied = careerUsers.stream().anyMatch(careerUser -> {
					return careerUser != null && careerUser.getCareer() != null
							&& careerUser.getCareer().getInternship() != null
							&& careerUser.getCareer().getInternship().getId().equals(jobResponseDTO.getInternshipId());
				});
				jobResponseDTO.setApplied(applied);
			}
		}
	}

	public void mapCertificationApplied(List<CertificationResponseDTO> result, List<CareerUser> careerUsers) {
		if (careerUsers != null) {
			for (CertificationResponseDTO jobResponseDTO : result) {
				boolean applied = careerUsers.stream().anyMatch(careerUser -> {
					return careerUser != null && careerUser.getCareer() != null
							&& careerUser.getCareer().getCertification() != null && careerUser.getCareer()
							.getCertification().getId().equals(jobResponseDTO.getCertificationId());
				});
				jobResponseDTO.setApplied(applied);
			}
		}
	}

	public List<CareerResponseDTO> generateMyCareerResponseDTO(List<CareerUser> careers) {
		List<CareerResponseDTO> result = new ArrayList<CareerResponseDTO>();
		for (CareerUser careerUser : careers) {
			CareerResponseDTO careerResponseDTO = new CareerResponseDTO();
			if (DocumentTypeEnum.JOB.getCode().equals(careerUser.getCareer().getCareerType())) {
				careerResponseDTO.setJobResponseDTO(generateJobObj(careerUser.getCareer().getJob(), null));
			}
			if (DocumentTypeEnum.INTERNSHIP.getCode().equals(careerUser.getCareer().getCareerType())) {
				careerResponseDTO
						.setInternshipResponseDTO(generateInternshipObj(careerUser.getCareer().getInternship(), null));
			}
			if (DocumentTypeEnum.PROJECT.getCode().equals(careerUser.getCareer().getCareerType())) {
				careerResponseDTO.setProjectResponseDTO(generateProjectObj(careerUser.getCareer().getProject(), null));
			}
			if (DocumentTypeEnum.CERTIFICATION.getCode().equals(careerUser.getCareer().getCareerType())) {
				careerResponseDTO.setCertificationResponseDTO(generateCertificationObj(careerUser.getCareer().getCertification(), null));
			}
			result.add(careerResponseDTO);
		}
		return result;
	}

	public List<CareerResponseDTO> generateCareerResponseDTO(List<Career> careers) {
		List<CareerResponseDTO> result = new ArrayList<CareerResponseDTO>();
		for (Career career : careers) {
			CareerResponseDTO careerResponseDTO = new CareerResponseDTO();
			if (DocumentTypeEnum.JOB.getCode().equals(career.getCareerType())) {
				careerResponseDTO.setJobResponseDTO(generateJobObj(career.getJob(), null));
			}
			if (DocumentTypeEnum.INTERNSHIP.getCode().equals(career.getCareerType())) {
				careerResponseDTO.setInternshipResponseDTO(generateInternshipObj(career.getInternship(), null));
			}
			if (DocumentTypeEnum.PROJECT.getCode().equals(career.getCareerType())) {
				careerResponseDTO.setProjectResponseDTO(generateProjectObj(career.getProject(), null));
			}
			if (DocumentTypeEnum.CERTIFICATION.getCode().equals(career.getCareerType())) {
				careerResponseDTO.setCertificationResponseDTO(generateCertificationObj(career.getCertification(), null));
			}
			result.add(careerResponseDTO);
		}
		return result;
	}

	public List<CareerResponseDTO> generateCareerResponseDTO(List<Career> careers, List<CareerUser> careerUsers) {
		List<CareerResponseDTO> result = new ArrayList<CareerResponseDTO>();
		for (Career career : careers) {
			CareerResponseDTO careerResponseDTO = new CareerResponseDTO();
			if (DocumentTypeEnum.JOB.getCode().equals(career.getCareerType())) {
				careerResponseDTO.setJobResponseDTO(generateJobObj(career.getJob(), careerUsers));
			}
			if (DocumentTypeEnum.INTERNSHIP.getCode().equals(career.getCareerType())) {
				careerResponseDTO.setInternshipResponseDTO(generateInternshipObj(career.getInternship(), careerUsers));
			}
			if (DocumentTypeEnum.PROJECT.getCode().equals(career.getCareerType())) {
				careerResponseDTO.setProjectResponseDTO(generateProjectObj(career.getProject(), careerUsers));
			}
			if (DocumentTypeEnum.CERTIFICATION.getCode().equals(career.getCareerType())) {
				careerResponseDTO.setCertificationResponseDTO(generateCertificationObj(career.getCertification(), careerUsers));
			}
			result.add(careerResponseDTO);
		}
		return result;
	}

	public ContactUs generatecontactUsObj(Long userId, ContactRequestDTO contactRequestDTO) {
		ContactUs contact = new ContactUs();
		contact.setCategory(contactRequestDTO.getCategory());
		contact.setCreatedBy(new UserDetail(userId));
		contact.setCreatedDate(new Date());
		contact.setDocument(contactRequestDTO.getDocument());
		contact.setMessage(contactRequestDTO.getMessage());
		contact.setSubject(contactRequestDTO.getSubject());
		contact.setUpdateddDate(new Date());
		return contact;
	}

	public List<CertificationResponseDTO> generateCertificationResponse(List<Certification> internships,
																		List<CareerUser> careerUsers, List<CareerUser> careerUsersApplied) {
		List<CertificationResponseDTO> targetList = new ArrayList<CertificationResponseDTO>();
		targetList = internships.stream().map(internship -> {
			return generateCertificationObj(internship, careerUsersApplied);
		}).collect(Collectors.toList());
		mapCertificationApplied(targetList, careerUsers);
		return targetList;
	}

	private CertificationResponseDTO generateCertificationObj(Certification certification,
															  List<CareerUser> careerUsers) {
		CertificationResponseDTO certificationResponseDTO = new CertificationResponseDTO();
		certificationResponseDTO.setCertFee(certification.getCertFee());
		certificationResponseDTO.setCertificationId(certification.getId());
		certificationResponseDTO.setCertLogo(certification.getCertLogo());
		certificationResponseDTO.setContactNo(certification.getContactNo());
		certificationResponseDTO.setCoverPage(certification.getCoverPage());
		certificationResponseDTO.setCreatedDate(certification.getCreatedDate());
		certificationResponseDTO.setDesc(certification.getDesc());
		certificationResponseDTO.setDuration(certification.getDuration());
		certificationResponseDTO.setDurationUnit(certification.getDurationUnit());
		certificationResponseDTO.setEligibility(certification.getEligibility());
		certificationResponseDTO.setEmail(certification.getEmail());
		certificationResponseDTO.setEndDate(certification.getEndDate());
		certificationResponseDTO.setField(certification.getField());
		certificationResponseDTO.setMode(certification.getMode());
		certificationResponseDTO.setReason(certification.getReason());
		certificationResponseDTO.setStartDate(certification.getStartDate());
		certificationResponseDTO.setStatus(certification.getStatus());
		certificationResponseDTO.setTitle(certification.getTitle());
		certificationResponseDTO.setTags(setHashTag(certification.getCareerTags()));
		certificationResponseDTO.setUpdateddDate(certification.getUpdateddDate());
		if (careerUsers != null) {
			certificationResponseDTO.setAppliedCount(
					getCountByStatus(careerUsers, certification.getId(), "Applied", DocumentTypeEnum.CERTIFICATION));
			certificationResponseDTO.setSelectedCount(
					getCountByStatus(careerUsers, certification.getId(), "Accepted", DocumentTypeEnum.CERTIFICATION));
			certificationResponseDTO.setRejectedCount(
					getCountByStatus(careerUsers, certification.getId(), "Rejected", DocumentTypeEnum.CERTIFICATION));
		}
		return certificationResponseDTO;
	}

	public void sendWelcomeEmail(com.simtech.entity.UserDetail userDetail) {
		try {
			if (!"Student".equals(userDetail.getRole())) {
				String userEmail;
				try {
					userEmail = encryptDecryptUtil.decrypt(userDetail.getEmailId());
				} catch (Exception e) {
					userEmail = userDetail.getEmailId();
				}
				String subject = "Welcome to TechCell!";
				String htmlContent = emailTemplateService.prepareWelcomeEmail(
				        userDetail.getFirstName(), userDetail.getLastName(), false);
				emailService.sendHtmlEmail(userEmail, subject, htmlContent, false);
			}
		} catch (Exception e) {
			logger.error("Failed to send welcome email", e);
		}
	}

}
