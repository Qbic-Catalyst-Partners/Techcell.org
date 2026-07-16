package com.simtech.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

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
import com.simtech.entity.HashTag;
import com.simtech.entity.Resume;
import com.simtech.entity.SecurityQuestion;
import com.simtech.dto.ProfilePhotoDTO;
import com.simtech.dto.EmailSuggestionDTO;

public interface UserService {

	void addUser(List<UserCreateDTO> userCreateDTOs);

	UserSigninResponseDTO signIn(UserSigninRequestDTO userSignin);

	void generateSigninOTP(String emailId);

	UserSigninResponseDTO signInUsingOTP(UserSigninRequestDTO userSignin);

	UserSigninResponseDTO verifyOTP(OTPVerificationRequestDTO userSignin);

	SecurityQuestion getSecurityQuestion(String emailId);

	Boolean verifySecurityQuestion(VerifySecurityQuestionReqDTO securityQuestionReqDTO);

	void resetPassword(ResetPasswordDTO resetPasswordDTO);

	List<PostingResponseDTO> getPostingList(DocumentTypeEnum documentTypeEnum, HttpServletRequest request, int page,
											int size);

	void addToFavourite(HttpServletRequest request, FavouriteRequestDTO favoriteRequestDTO);

	List<PostingResponseDTO> getMyFavouritePostingList(HttpServletRequest request, DocumentTypeEnum documentTypeEnum,
													   int page, int size);

	List<PostingResponseDTO> getMyPostingList(HttpServletRequest request, DocumentTypeEnum documentTypeEnum,
											  Long userId, int page, int size);

	List<UsedAccessDTO> getMyAccess(HttpServletRequest request);

	List<PostingResponseDTO> getPostingListByTagId(HttpServletRequest request, DocumentTypeEnum documentTypeEnum,
												   Long tagId, int page, int size);

	void likePost(HttpServletRequest request, LikePostRequestDTO likePostRequestDTO);

	Set<HashTag> getMyFavouritePostingList(HttpServletRequest request);

	List<PostingResponseDTO> getPostingListUsingFavTag(HttpServletRequest request, List<Long> hashTagList,
													   String status, int page, int size);

	PostingResponseDTO getPosting(HttpServletRequest request, Long postingId);

	UserProfileResponseDTO getUserDetail(HttpServletRequest request, Long userId);

	void deleteFavouriteTagList(HttpServletRequest request, List<Long> tagIds);

	void addComment(HttpServletRequest request, PostingCommentRequestDTO postingCommentRequestDTO);

	List<PostingCommentResponseDTO> getComments(Long postingId, int page, int size);

	void updateWelcomeScreen(HttpServletRequest request);

	void updateComment(HttpServletRequest request, Long commentId, PostingCommentRequestDTO postingCommentRequestDTO);

	void deleteComment(Long commentId);

	void updateUser(HttpServletRequest request, UserUpdateDTO userUpdateDTO);

	void generateOTP(HttpServletRequest request, boolean email, boolean sms, String reason);

	void addFavouriteTag(HttpServletRequest request, List<Long> hashTagList);

	List<UserDetailShortResponseDTO> getUserDetails(HttpServletRequest request, String role, String name);

	List<CommunityPostingResponseDTO> getCommunityList(HttpServletRequest request, String orderByField,
													   String direction, int page, int size);

	void joinCommunity(HttpServletRequest request, Long communityId);

	void exitCommunity(HttpServletRequest request, Long communityId);

	List<PostSoftwareResponseDTO> getSoftwareByTagId(HttpServletRequest request, Long tagId, int page, int size);

	List<CommunityUserDTO> getCommunityMembers(HttpServletRequest request, Long communityId);

	List<PostingResponseDTO> getFeedList(HttpServletRequest request, Long communityId, int page, int size);

	List<CommunityUserResponseDTO> getMyCommunityList(HttpServletRequest request, int page, int size);

	List<CommunityUserResponseDTO> getCommunityListByUserId(HttpServletRequest request, Long userId);

	Set<HashTag> getFavouriteTagListByUserId(HttpServletRequest request, Long userId);

	List<InternshipResponseDTO> getInternshipsByTagId(HttpServletRequest request, Long tagId, int page, int size);

	void careerApply(HttpServletRequest request, CareerApplyRequestDTO careerApplyRequestDTO);

	List<JobResponseDTO> getJobsByTagId(HttpServletRequest request, Long tagId, int page, int size);

	List<CommunityPostingResponseDTO> getSuggestedCommunityList(HttpServletRequest request, int page, int size);

	void viewPost(HttpServletRequest request, Long postId);

	List<CareerResponseDTO> getMyAppliedCareerList(HttpServletRequest request, int page, int size);

	List<CareerResponseDTO> getCareerList(HttpServletRequest request, int page, int size);

	void approvePost(HttpServletRequest request, ApprovePostRequestDTO approvePostRequestDTO);

	HashTag getMyCommunityTagList(HttpServletRequest request);

	String assignModerator(HttpServletRequest request, CommunityModeratorRequestDTO communityModeratorRequestDTO);

	List<ProjectResponseDTO> getProjectsByTagId(HttpServletRequest request, Long tagId, int page, int size);

	void contactUs(HttpServletRequest request, ContactRequestDTO contactRequestDTO);

	Map<String, Long> getCounts(HttpServletRequest request);

	List<CommunityUserResponseDTO> getUserCommunityList(HttpServletRequest request, Long userId, int page, int size);

	void updateCareerStatus(HttpServletRequest request, UpdateStatusRequestDTO careerDeleteRequestDTO);

	List<CertificationResponseDTO> getCertificationByTagId(HttpServletRequest request, Long tagId, int page, int size);

	void updatePostingStatus(HttpServletRequest request, UpdateStatusRequestDTO updateStatusRequestDTO);

	List<PostingResponseDTO> listPostings(HttpServletRequest request, ListingRequestDTO listingRequestDTO);

	List<InternshipResponseDTO> listInternships(HttpServletRequest request, ListingRequestDTO listingRequestDTO);

	List<ProjectResponseDTO> listProjects(HttpServletRequest request, ListingRequestDTO listingRequestDTO);

	List<CertificationResponseDTO> listCertifications(HttpServletRequest request, ListingRequestDTO listingRequestDTO);

	List<JobResponseDTO> listJobs(HttpServletRequest request, ListingRequestDTO listingRequestDTO);

	void logOut(HttpServletRequest request);

	List<PostSoftwareResponseDTO> listSoftware(ListingRequestDTO listingRequestDTO);

	List<UserDetailResponseDTO> listUserDetails(ListingRequestDTO listingRequestDTO);

	List<PostingCommentResponseDTO> getReplyComments(Long parentCommentId, int page, int size);

	void updateResume(HttpServletRequest request, MaintainResumeRequestDTO maintainResumeRequestDTO);

	Resume getResume(HttpServletRequest request, Long userId);

	List<CareerAppliedDTO> getCareerAppliedList(HttpServletRequest request, DocumentTypeEnum careerType, Long id,
												String status, int page, int size);

	void careerApprove(HttpServletRequest request, CareerApproveRequestDTO careerApplyRequestDTO);

	void updateSoftwareStatus(HttpServletRequest request, UpdateStatusRequestDTO updateStatusRequestDTO);

	List<CommunityPostingResponseDTO> getCommunityListByTagId(HttpServletRequest request, Long tagId, int page,
															  int size);

	void validateSession(Long userId);

	/** Returns up to 10 users whose name contains the query (case-insensitive) */
	java.util.List<EmailSuggestionDTO> searchUsersByName(String query);

	/** Existing email suggestions */
	java.util.List<EmailSuggestionDTO> searchUsersByEmail(String query);

	void updateProfilePhoto(HttpServletRequest request, ProfilePhotoDTO profilePhotoDTO);

}
