package com.simtech.controller;

import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.simtech.dto.ApprovePostRequestDTO;
import com.simtech.dto.CareerAppliedDTO;
import com.simtech.dto.CareerApplyRequestDTO;
import com.simtech.dto.CareerApproveRequestDTO;
import com.simtech.dto.CareerResponseDTO;
import com.simtech.dto.CertificationRequestDTO;
import com.simtech.dto.CertificationResponseDTO;
import com.simtech.dto.CommunityModeratorRequestDTO;
import com.simtech.dto.CommunityPostingResponseDTO;
import com.simtech.dto.CommunityUserDTO;
import com.simtech.dto.CommunityUserResponseDTO;
import com.simtech.dto.ContactRequestDTO;
import com.simtech.dto.EmailSuggestionDTO;
import com.simtech.dto.FavouriteRequestDTO;
import com.simtech.dto.InternshipRequestDTO;
import com.simtech.dto.InternshipResponseDTO;
import com.simtech.dto.JobRequestDTO;
import com.simtech.dto.JobResponseDTO;
import com.simtech.dto.LikePostRequestDTO;
import com.simtech.dto.ListingRequestDTO;
import com.simtech.dto.MaintainResumeRequestDTO;
import com.simtech.dto.OTPVerificationRequestDTO;
import com.simtech.dto.PostBlogRequestDTO;
import com.simtech.dto.PostCommunityRequestDTO;
import com.simtech.dto.PostFeedRequestDTO;
import com.simtech.dto.PostSoftwareRequestDTO;
import com.simtech.dto.PostSoftwareResponseDTO;
import com.simtech.dto.PostVideoRequestDTO;
import com.simtech.dto.PostingCommentRequestDTO;
import com.simtech.dto.PostingCommentResponseDTO;
import com.simtech.dto.PostingResponseDTO;
import com.simtech.dto.ProjectRequestDTO;
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
import com.simtech.dto.ProfilePhotoDTO;
import com.simtech.dto.constant.DocumentTypeEnum;
import com.simtech.entity.HashTag;
import com.simtech.entity.Resume;
import com.simtech.entity.SecurityQuestion;
import com.simtech.response.BasicResponse;
import com.simtech.response.StandardResponse;
import com.simtech.service.ContentPostService;
import com.simtech.service.SMSService;
import com.simtech.service.UserService;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/api/")
@CrossOrigin(maxAge = 3600, origins = { "*" }, methods = { RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.PUT,
		RequestMethod.DELETE, RequestMethod.POST })
public class UserController {
	@Autowired
	UserService userService;
	@Autowired
	ContentPostService contentPostService;

	@PostMapping("public/addUser")
	@ApiOperation(value = "This API is used to Add a User")
	public BasicResponse addUserDetail(@RequestBody List<UserCreateDTO> userCreateDTOs) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.addUser(userCreateDTOs);
		return response;
	}

	@PostMapping("public/signIn")
	@ApiOperation(value = "This API is used to signIn")
	public StandardResponse<UserSigninResponseDTO> signIn(@RequestBody UserSigninRequestDTO userSignin) {
		StandardResponse<UserSigninResponseDTO> response = new StandardResponse<UserSigninResponseDTO>();
		response.setResponseOK();
		response.setData(userService.signIn(userSignin));
		return response;
	}

	@PostMapping("public/signInUsingOTP")
	@ApiOperation(value = "This API is used to Add a User")
	public StandardResponse<UserSigninResponseDTO> signInUsingOTP(@RequestBody UserSigninRequestDTO userSignin) {
		StandardResponse<UserSigninResponseDTO> response = new StandardResponse<UserSigninResponseDTO>();
		response.setResponseOK();
		response.setData(userService.signInUsingOTP(userSignin));
		return response;
	}

	@PostMapping("public/verifyOTP")
	@ApiOperation(value = "This API is used to Add a User")
	public StandardResponse<UserSigninResponseDTO> verifyOTP(@RequestBody OTPVerificationRequestDTO userSignin) {
		StandardResponse<UserSigninResponseDTO> response = new StandardResponse<UserSigninResponseDTO>();
		response.setResponseOK();
		response.setData(userService.verifyOTP(userSignin));
		return response;
	}

	@PostMapping("public/generateSigninOTP")
	@ApiOperation(value = "This API is used to Add a User")
	public BasicResponse generateSigninOTP(@RequestParam String emailId) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.generateSigninOTP(emailId);
		return response;
	}

	@GetMapping("public/getSecurityQuestion")
	public StandardResponse<SecurityQuestion> getSecurityQuestion(
			@RequestParam(name = "emailId", required = true) String emailId) {
		StandardResponse<SecurityQuestion> response = new StandardResponse<SecurityQuestion>();
		response.setResponseOK();
		response.setData(userService.getSecurityQuestion(emailId));
		return response;
	}

	@PostMapping("public/verifySecurityQuestion")
	@ApiOperation(value = "This API is used to Add a User")
	public StandardResponse<Boolean> verifySecurityQuestion(
			@RequestBody VerifySecurityQuestionReqDTO securityQuestionReqDTO) {
		StandardResponse<Boolean> response = new StandardResponse<Boolean>();
		response.setResponseOK();
		response.setData(userService.verifySecurityQuestion(securityQuestionReqDTO));
		return response;
	}

	@PostMapping("public/resetPassword")
	@ApiOperation(value = "This API is used to reset password")
	public BasicResponse resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.resetPassword(resetPasswordDTO);
		return response;
	}

	@PostMapping("user/addVideo")
	@ApiOperation(value = "This API is used to Add Video")
	public BasicResponse addVideo(HttpServletRequest request, @RequestBody PostVideoRequestDTO postVideoRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		contentPostService.createPost(request, postVideoRequestDTO);
		return response;
	}

	@PostMapping("user/addBlog")
	@ApiOperation(value = "This API is used to Add Video")
	public BasicResponse addBlog(HttpServletRequest request, @RequestBody PostBlogRequestDTO postBlogRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		contentPostService.createPost(request, postBlogRequestDTO);
		return response;
	}

	@PostMapping("user/addCommunity")
	@ApiOperation(value = "This API is used to Add Community")
	public BasicResponse addCommunity(HttpServletRequest request,
									  @RequestBody PostCommunityRequestDTO communityRequestDTO) {
		String msg = contentPostService.createPost(request, communityRequestDTO);
		BasicResponse response = new BasicResponse();
		if (msg != null && !msg.isEmpty()) {
			response.setResponseOK(msg);
		} else {
			response.setResponseOK("Community Uploaded Successfully!");
		}
		return response;
	}

	@PostMapping("user/addFeed")
	@ApiOperation(value = "This API is used to Add new feed for given community")
	public BasicResponse addFeed(HttpServletRequest request, @RequestBody PostFeedRequestDTO feedRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		contentPostService.createPost(request, feedRequestDTO);
		return response;
	}

	@GetMapping("user/getPostingList")
	@ApiOperation(value = "This API is List all the posting")
	public StandardResponse<List<PostingResponseDTO>> getPostingList(HttpServletRequest request,
																	 @RequestParam(name = "documentTypeEnum", required = false) DocumentTypeEnum documentTypeEnum,
																	 @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<PostingResponseDTO>> response = new StandardResponse<List<PostingResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getPostingList(documentTypeEnum, request, page, size));
		return response;
	}

	@GetMapping("user/getPosting")
	@ApiOperation(value = "This API is List all the posting")
	public StandardResponse<PostingResponseDTO> getPosting(HttpServletRequest request,
														   @RequestParam(name = "postingId", required = true) Long postingId) {
		StandardResponse<PostingResponseDTO> response = new StandardResponse<PostingResponseDTO>();
		response.setResponseOK();
		response.setData(userService.getPosting(request, postingId));
		return response;
	}

	@GetMapping("user/getPostingListUsingFavTag")
	@ApiOperation(value = "This API is List all the posting By using Favourite Post Tag")
	public StandardResponse<List<PostingResponseDTO>> getPostingListUsingFavTag(HttpServletRequest request,
																				@RequestParam(name = "hashTagList", required = false) List<Long> hashTagList,
																				@RequestParam(name = "status", required = false, defaultValue = "Approved") String status,
																				@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<PostingResponseDTO>> response = new StandardResponse<List<PostingResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getPostingListUsingFavTag(request, hashTagList, status, page, size));
		return response;
	}

	@PostMapping("user/addToFavourite")
	@ApiOperation(value = "This API is used to Add Video")
	public BasicResponse addToFavourite(HttpServletRequest request,
										@RequestBody FavouriteRequestDTO favouriteRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.addToFavourite(request, favouriteRequestDTO);
		return response;
	}

	@GetMapping("user/getMyFavouritePostingList")
	@ApiOperation(value = "This API is user to List my favorite for given posting type like videos blogs")
	public StandardResponse<List<PostingResponseDTO>> getMyFavouritePostingList(HttpServletRequest request,
																				DocumentTypeEnum documentTypeEnum, @RequestParam(defaultValue = "0") int page,
																				@RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<PostingResponseDTO>> response = new StandardResponse<List<PostingResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getMyFavouritePostingList(request, documentTypeEnum, page, size));
		return response;
	}

	@GetMapping("user/getMyPostingList")
	@ApiOperation(value = "This API is List all the posting")
	public StandardResponse<List<PostingResponseDTO>> getMyPostingList(HttpServletRequest request,
																	   DocumentTypeEnum documentTypeEnum, Long userId, @RequestParam(defaultValue = "0") int page,
																	   @RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<PostingResponseDTO>> response = new StandardResponse<List<PostingResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getMyPostingList(request, documentTypeEnum, userId, page, size));
		return response;
	}

	@GetMapping("user/getPostingListByTagId")
	@ApiOperation(value = "This API is List all the posting")
	public StandardResponse<List<PostingResponseDTO>> getPostingListByTagId(HttpServletRequest request,
																			DocumentTypeEnum documentTypeEnum, Long tagId, @RequestParam(defaultValue = "0") int page,
																			@RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<PostingResponseDTO>> response = new StandardResponse<List<PostingResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getPostingListByTagId(request, documentTypeEnum, tagId, page, size));
		return response;
	}

	@GetMapping("user/getCommunityListByTagId")
	@ApiOperation(value = "This API is List all the posting")
	public StandardResponse<List<CommunityPostingResponseDTO>> getCommunityListByTagId(HttpServletRequest request,
																					   Long tagId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<CommunityPostingResponseDTO>> response = new StandardResponse<List<CommunityPostingResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getCommunityListByTagId(request, tagId, page, size));
		return response;
	}

	@PostMapping("user/likePost")
	@ApiOperation(value = "This API is used to Like a Post")
	public BasicResponse likePost(HttpServletRequest request, @RequestBody LikePostRequestDTO likePostRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.likePost(request, likePostRequestDTO);
		return response;
	}

	@PutMapping("user/viewPost/{postId}")
	@ApiOperation(value = "This API is used to increase view count")
	public BasicResponse viewPost(HttpServletRequest request, @PathVariable Long postId) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.viewPost(request, postId);
		return response;
	}

	@PutMapping("user/logOut")
	@ApiOperation(value = "This API is used to Delete Token from usersignin Table")
	public BasicResponse logOut(HttpServletRequest request) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.logOut(request);
		return response;
	}

	@PostMapping("user/approvePost")
	@ApiOperation(value = "This API is used to Like a Post")
	public BasicResponse approvePost(HttpServletRequest request,
									 @RequestBody ApprovePostRequestDTO approvePostRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.approvePost(request, approvePostRequestDTO);
		return response;
	}

	@GetMapping("user/getMyAccess")
	@ApiOperation(value = "This API is List all the posting")
	public StandardResponse<List<UsedAccessDTO>> getMyAccess(HttpServletRequest request) {
		StandardResponse<List<UsedAccessDTO>> response = new StandardResponse<List<UsedAccessDTO>>();
		response.setResponseOK();
		response.setData(userService.getMyAccess(request));
		return response;
	}

	@GetMapping("user/getMyFavouriteTagList")
	@ApiOperation(value = "This API is user to List my favorite Tags")
	public StandardResponse<Set<HashTag>> getMyFavouriteTagList(HttpServletRequest request) {
		StandardResponse<Set<HashTag>> response = new StandardResponse<Set<HashTag>>();
		response.setResponseOK();
		response.setData(userService.getMyFavouritePostingList(request));
		return response;
	}

	@GetMapping("user/getFavouriteTagListByUserId")
	@ApiOperation(value = "This API is user to List favorite Tags for Given UserId")
	public StandardResponse<Set<HashTag>> getFavouriteTagListByUserId(HttpServletRequest request,
																	  @RequestParam(name = "userId", required = true) Long userId) {
		StandardResponse<Set<HashTag>> response = new StandardResponse<Set<HashTag>>();
		response.setResponseOK();
		response.setData(userService.getFavouriteTagListByUserId(request, userId));
		return response;
	}

	@GetMapping("user/getUserDetail")
	@ApiOperation(value = "This API is used to get The user detail for Profile Page")
	public StandardResponse<UserProfileResponseDTO> getUserDetail(HttpServletRequest request,
																  @RequestParam(name = "userId", required = false) Long userId) {
		StandardResponse<UserProfileResponseDTO> response = new StandardResponse<UserProfileResponseDTO>();
		response.setResponseOK();
		response.setData(userService.getUserDetail(request, userId));
		return response;
	}

	@GetMapping("user/getUserDetails")
	@ApiOperation(value = "This API is used to get The user detail for Profile Page")
	public StandardResponse<List<UserDetailShortResponseDTO>> getUserDetails(HttpServletRequest request,
																			 @RequestParam(name = "role", required = true) String role, @RequestParam(defaultValue = "") String name) {
		StandardResponse<List<UserDetailShortResponseDTO>> response = new StandardResponse<List<UserDetailShortResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getUserDetails(request, role, name));
		return response;
	}

	@DeleteMapping("user/deleteFavouriteTagList")
	@ApiOperation(value = "This API is List all the posting By using Favourite Post Tag")
	public BasicResponse deleteFavouriteTagList(HttpServletRequest request,
												@RequestParam(name = "hashTagList", required = true) List<Long> hashTagList) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.deleteFavouriteTagList(request, hashTagList);
		return response;
	}

	@PostMapping("user/addComment")
	@ApiOperation(value = "This API is used to Add comment")
	public BasicResponse addComment(HttpServletRequest request,
									@RequestBody PostingCommentRequestDTO postingCommentRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.addComment(request, postingCommentRequestDTO);
		return response;
	}

	@GetMapping("user/getComments")
	@ApiOperation(value = "This API is used to get The comment List for given posting id with Pagination")
	public StandardResponse<List<PostingCommentResponseDTO>> getComments(HttpServletRequest request,
																		 @RequestParam(name = "postingId", required = true) Long postingId,
																		 @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "3") int size) {
		StandardResponse<List<PostingCommentResponseDTO>> response = new StandardResponse<List<PostingCommentResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getComments(postingId, page, size));
		return response;
	}

	@GetMapping("user/getReplyComments")
	@ApiOperation(value = "This API is used to get The comment List for given posting id with Pagination")
	public StandardResponse<List<PostingCommentResponseDTO>> getReplyComments(HttpServletRequest request,
																			  @RequestParam(name = "parentCommentId", required = true) Long parentCommentId,
																			  @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "3") int size) {
		StandardResponse<List<PostingCommentResponseDTO>> response = new StandardResponse<List<PostingCommentResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getReplyComments(parentCommentId, page, size));
		return response;
	}

	@PutMapping("user/updateComment/{commentId}")
	@ApiOperation(value = "This API is used to Add comment")
	public BasicResponse updateComment(HttpServletRequest request, @PathVariable Long commentId,
									   @RequestBody PostingCommentRequestDTO postingCommentRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.updateComment(request, commentId, postingCommentRequestDTO);
		return response;
	}

	@DeleteMapping("user/deleteComment/{commentId}")
	@ApiOperation(value = "This API is used to Add comment")
	public BasicResponse deleteComment(@PathVariable Long commentId) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.deleteComment(commentId);
		return response;
	}

	@PutMapping("user/updateUser")
	@ApiOperation(value = "This API is used to Update user Details")
	public BasicResponse updateUser(HttpServletRequest request, @RequestBody UserUpdateDTO userUpdateDTO) {
		userService.updateUser(request, userUpdateDTO);
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		return response;
	}

	@GetMapping("user/generateOTP")
	@ApiOperation(value = "This API is used to send OTP")
	public BasicResponse generateOTP(HttpServletRequest request, @RequestParam boolean email, @RequestParam boolean sms,
									 @RequestParam String reason) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.generateOTP(request, email, sms, reason);
		return response;
	}

	@PostMapping("user/addFavouriteTag")
	@ApiOperation(value = "This API is used to Add comment")
	public BasicResponse addFavouriteTag(HttpServletRequest request,
										 @RequestParam(name = "hashTagList", required = true) List<Long> hashTagList) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.addFavouriteTag(request, hashTagList);
		return response;
	}

	@GetMapping("user/getCommunityList")
	@ApiOperation(value = "This API is List all the posting")
	public StandardResponse<List<CommunityPostingResponseDTO>> getCommunityList(HttpServletRequest request,
																				@RequestParam String orderByField, String direction, @RequestParam(defaultValue = "0") int page,
																				@RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<CommunityPostingResponseDTO>> response = new StandardResponse<List<CommunityPostingResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getCommunityList(request, orderByField, direction, page, size));
		return response;
	}

	@GetMapping("user/getSuggestedCommunityList")
	@ApiOperation(value = "This API is List Suggested CommunityList for logged in user")
	public StandardResponse<List<CommunityPostingResponseDTO>> getSuggestedCommunityList(HttpServletRequest request,
																						 @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<CommunityPostingResponseDTO>> response = new StandardResponse<List<CommunityPostingResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getSuggestedCommunityList(request, page, size));
		return response;
	}

	@GetMapping("user/getMyCommunityList")
	@ApiOperation(value = "This API is used to Get community List for loggedin User")
	public StandardResponse<List<CommunityUserResponseDTO>> getMyCommunityList(HttpServletRequest request,
																			   @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<CommunityUserResponseDTO>> response = new StandardResponse<List<CommunityUserResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getMyCommunityList(request, page, size));
		return response;
	}

	@GetMapping("user/getUserCommunityList")
	@ApiOperation(value = "This API is used to Get community List for given User")
	public StandardResponse<List<CommunityUserResponseDTO>> getUserCommunityList(HttpServletRequest request,
																				 Long userId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<CommunityUserResponseDTO>> response = new StandardResponse<List<CommunityUserResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getUserCommunityList(request, userId, page, size));
		return response;
	}

	@GetMapping("user/getCommunityListByUserId")
	@ApiOperation(value = "This API is used to Get community List for given Userid")
	public StandardResponse<List<CommunityUserResponseDTO>> getCommunityListByUserId(HttpServletRequest request,
																					 @RequestParam(name = "userId", required = true) Long userId) {
		StandardResponse<List<CommunityUserResponseDTO>> response = new StandardResponse<List<CommunityUserResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getCommunityListByUserId(request, userId));
		return response;
	}

	@PostMapping("user/joinCommunity/{communityId}")
	@ApiOperation(value = "This API is used to Join a Community")
	public BasicResponse joinCommunity(HttpServletRequest request, @PathVariable Long communityId) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.joinCommunity(request, communityId);
		return response;
	}

	@PostMapping("user/assignModerator")
	@ApiOperation(value = "This API is used to Add or update Moderator")
	public BasicResponse assignModerator(HttpServletRequest request,
										 @RequestBody CommunityModeratorRequestDTO communityModeratorRequestDTO) {
		String msg = userService.assignModerator(request, communityModeratorRequestDTO);
		BasicResponse response = new BasicResponse();
		response.setResponseOK(msg);
		return response;
	}

	@DeleteMapping("user/exitCommunity/{communityId}")
	@ApiOperation(value = "This API is used to exit a Community")
	public BasicResponse exitCommunity(HttpServletRequest request, @PathVariable Long communityId) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.exitCommunity(request, communityId);
		return response;
	}

	@PostMapping("user/addSoftware")
	@ApiOperation(value = "This API is used to Add new software")
	public BasicResponse addSoftware(HttpServletRequest request,
									 @RequestBody PostSoftwareRequestDTO softwareRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		contentPostService.addSoftware(request, softwareRequestDTO);
		return response;
	}

	@PostMapping("user/listSoftware")
	@ApiOperation(value = "This API is used to get Posting List")
	public StandardResponse<List<PostSoftwareResponseDTO>> listSoftware(HttpServletRequest request,
																		@RequestBody ListingRequestDTO listingRequestDTO) {
		StandardResponse<List<PostSoftwareResponseDTO>> response = new StandardResponse<List<PostSoftwareResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.listSoftware(listingRequestDTO));
		return response;
	}

	@GetMapping("user/getSoftwareByTagId")
	@ApiOperation(value = "This API is List all the posting")
	public StandardResponse<List<PostSoftwareResponseDTO>> getSoftwareByTagId(HttpServletRequest request,
																			  @RequestParam(name = "tagId", required = true) Long tagId, @RequestParam(defaultValue = "0") int page,
																			  @RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<PostSoftwareResponseDTO>> response = new StandardResponse<List<PostSoftwareResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getSoftwareByTagId(request, tagId, page, size));
		return response;
	}

	@GetMapping("user/getCommunityMembers")
	@ApiOperation(value = "This API is List all the member of given community")
	public StandardResponse<List<CommunityUserDTO>> getCommunityMembers(HttpServletRequest request,
																		@RequestParam(name = "communityId", required = true) Long communityId) {
		StandardResponse<List<CommunityUserDTO>> response = new StandardResponse<List<CommunityUserDTO>>();
		response.setResponseOK();
		response.setData(userService.getCommunityMembers(request, communityId));
		return response;
	}

	@GetMapping("user/getFeedList")
	@ApiOperation(value = "This Api is used to Get List of feed for Given community")
	public StandardResponse<List<PostingResponseDTO>> getFeedList(HttpServletRequest request,
																  @RequestParam(name = "communityId", required = false) Long communityId,
																  @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<PostingResponseDTO>> response = new StandardResponse<List<PostingResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getFeedList(request, communityId, page, size));
		return response;
	}

	@PostMapping("user/addInternship")
	@ApiOperation(value = "This API is used to Add New Internship")
	public BasicResponse addInternship(HttpServletRequest request,
									   @RequestBody InternshipRequestDTO internshipRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		contentPostService.addInternship(request, internshipRequestDTO);
		return response;
	}

	@PostMapping("user/addProject")
	@ApiOperation(value = "This API is used to Add New Internship")
	public BasicResponse addProject(HttpServletRequest request, @RequestBody ProjectRequestDTO internshipRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		contentPostService.addProject(request, internshipRequestDTO);
		return response;
	}

	@GetMapping("user/getInternshipsByTagId")
	@ApiOperation(value = "This Api is used to Get Internships ByTagId ")
	public StandardResponse<List<InternshipResponseDTO>> getInternshipsByTagId(HttpServletRequest request,
																			   @RequestParam(name = "tagId", required = false) Long tagId, @RequestParam(defaultValue = "0") int page,
																			   @RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<InternshipResponseDTO>> response = new StandardResponse<List<InternshipResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getInternshipsByTagId(request, tagId, page, size));
		return response;
	}

	@PostMapping("user/careerApply")
	@ApiOperation(value = "This API is used to Add New Internship")
	public BasicResponse careerApply(HttpServletRequest request,
									 @RequestBody CareerApplyRequestDTO careerApplyRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.careerApply(request, careerApplyRequestDTO);
		return response;
	}

	@PostMapping("user/addJob")
	@ApiOperation(value = "This API is used to Add New Internship")
	public BasicResponse addJob(HttpServletRequest request, @RequestBody JobRequestDTO jobRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		contentPostService.addJob(request, jobRequestDTO);
		return response;
	}

	@GetMapping("user/getJobsByTagId")
	@ApiOperation(value = "This Api is used to Get Internships ByTagId ")
	public StandardResponse<List<JobResponseDTO>> getJobsByTagId(HttpServletRequest request,
																 @RequestParam(name = "tagId", required = false) Long tagId, @RequestParam(defaultValue = "0") int page,
																 @RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<JobResponseDTO>> response = new StandardResponse<List<JobResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getJobsByTagId(request, tagId, page, size));
		return response;
	}

	@GetMapping("user/getProjectByTagId")
	@ApiOperation(value = "This Api is used to Get Internships ByTagId ")
	public StandardResponse<List<ProjectResponseDTO>> getProjectByTagId(HttpServletRequest request,
																		@RequestParam(name = "tagId", required = false) Long tagId, @RequestParam(defaultValue = "0") int page,
																		@RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<ProjectResponseDTO>> response = new StandardResponse<List<ProjectResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getProjectsByTagId(request, tagId, page, size));
		return response;
	}

	@GetMapping("user/getMyAppliedCareerList")
	@ApiOperation(value = "This Api is used to Get applied career List")
	public StandardResponse<List<CareerResponseDTO>> getMyAppliedCareerList(HttpServletRequest request,
																			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<CareerResponseDTO>> response = new StandardResponse<List<CareerResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getMyAppliedCareerList(request, page, size));
		return response;
	}

	@GetMapping("user/getCareerList")
	@ApiOperation(value = "This Api is used to Get CareerList ")
	public StandardResponse<List<CareerResponseDTO>> getCareerList(HttpServletRequest request,
																   @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<CareerResponseDTO>> response = new StandardResponse<List<CareerResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getCareerList(request, page, size));
		return response;
	}

	@GetMapping("user/getMyCommunityTagList")
	@ApiOperation(value = "This API is user to List Tags where I am the Owner for approval of Posting")
	public StandardResponse<HashTag> getMyCommunityTagList(HttpServletRequest request) {
		StandardResponse<HashTag> response = new StandardResponse<HashTag>();
		response.setResponseOK();
		response.setData(userService.getMyCommunityTagList(request));
		return response;
	}

	@PostMapping("user/contactUs")
	@ApiOperation(value = "This API is used to Add a User")
	public BasicResponse contactUs(HttpServletRequest request, @RequestBody ContactRequestDTO contactRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.contactUs(request, contactRequestDTO);
		return response;
	}

	@GetMapping("user/getCounts")
	public StandardResponse<Map<String, Long>> getCounts(HttpServletRequest request) {
		StandardResponse<Map<String, Long>> response = new StandardResponse<Map<String, Long>>();
		response.setResponseOK();
		response.setData(userService.getCounts(request));
		return response;
	}

	@PostMapping("user/listUserDetails")
	@ApiOperation(value = "This API is used to get Posting List")
	public StandardResponse<List<UserDetailResponseDTO>> listUserDetails(HttpServletRequest request,
																		 @RequestBody ListingRequestDTO listingRequestDTO) {
		StandardResponse<List<UserDetailResponseDTO>> response = new StandardResponse<List<UserDetailResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.listUserDetails(listingRequestDTO));
		return response;
	}

	@PostMapping("user/listInternships")
	@ApiOperation(value = "This API is used to get Posting List")
	public StandardResponse<List<InternshipResponseDTO>> listInternships(HttpServletRequest request,
																		 @RequestBody ListingRequestDTO listingRequestDTO) {
		StandardResponse<List<InternshipResponseDTO>> response = new StandardResponse<List<InternshipResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.listInternships(request, listingRequestDTO));
		return response;
	}

	@PostMapping("user/listProjects")
	@ApiOperation(value = "This API is used to get Posting List")
	public StandardResponse<List<ProjectResponseDTO>> listProjects(HttpServletRequest request,
																   @RequestBody ListingRequestDTO listingRequestDTO) {
		StandardResponse<List<ProjectResponseDTO>> response = new StandardResponse<List<ProjectResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.listProjects(request, listingRequestDTO));
		return response;
	}

	@PostMapping("user/listJobs")
	@ApiOperation(value = "This API is used to get Posting List")
	public StandardResponse<List<JobResponseDTO>> listJobs(HttpServletRequest request,
														   @RequestBody ListingRequestDTO listingRequestDTO) {
		StandardResponse<List<JobResponseDTO>> response = new StandardResponse<List<JobResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.listJobs(request, listingRequestDTO));
		return response;
	}

	@PostMapping("user/listCertifications")
	@ApiOperation(value = "This API is used to get Posting List")
	public StandardResponse<List<CertificationResponseDTO>> listCertifications(HttpServletRequest request,
																			   @RequestBody ListingRequestDTO listingRequestDTO) {
		StandardResponse<List<CertificationResponseDTO>> response = new StandardResponse<List<CertificationResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.listCertifications(request, listingRequestDTO));
		return response;
	}

	@PostMapping("user/updateCareerStatus")
	@ApiOperation(value = "This API is used to delete the career")
	public BasicResponse updateCareerStatus(HttpServletRequest request,
											@RequestBody UpdateStatusRequestDTO careerDeleteRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.updateCareerStatus(request, careerDeleteRequestDTO);
		return response;
	}

	@PostMapping("user/addCertification")
	@ApiOperation(value = "This API is used to Add New Internship")
	public BasicResponse addCertification(HttpServletRequest request,
										  @RequestBody CertificationRequestDTO certificationRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		contentPostService.addCertification(request, certificationRequestDTO);
		return response;
	}

	@GetMapping("user/getCertificationByTagId")
	@ApiOperation(value = "This Api is used to Get Certifications ByTagId ")
	public StandardResponse<List<CertificationResponseDTO>> getCertificationByTagId(HttpServletRequest request,
																					@RequestParam(name = "tagId", required = false) Long tagId, @RequestParam(defaultValue = "0") int page,
																					@RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<CertificationResponseDTO>> response = new StandardResponse<List<CertificationResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.getCertificationByTagId(request, tagId, page, size));
		return response;
	}

	@PostMapping("user/updatePostingStatus")
	@ApiOperation(value = "This API is used to delete the career")
	public BasicResponse updatePostingStatus(HttpServletRequest request,
											 @RequestBody UpdateStatusRequestDTO careerDeleteRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.updatePostingStatus(request, careerDeleteRequestDTO);
		return response;
	}

	@PostMapping("user/updateSoftwareStatus")
	@ApiOperation(value = "This API is used to update Software Status")
	public BasicResponse updateSoftwareStatus(HttpServletRequest request,
											  @RequestBody UpdateStatusRequestDTO updateStatusRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.updateSoftwareStatus(request, updateStatusRequestDTO);
		return response;
	}

	@PostMapping("user/listPostings")
	@ApiOperation(value = "This API is used to get Posting List")
	public StandardResponse<List<PostingResponseDTO>> listPostings(HttpServletRequest request,
																   @RequestBody ListingRequestDTO listingRequestDTO) {
		StandardResponse<List<PostingResponseDTO>> response = new StandardResponse<List<PostingResponseDTO>>();
		response.setResponseOK();
		response.setData(userService.listPostings(request, listingRequestDTO));
		return response;
	}

	@PostMapping("user/updateResume")
	@ApiOperation(value = "This API is used to create or update Resume")
	public BasicResponse updateResume(HttpServletRequest request,
									  @RequestBody MaintainResumeRequestDTO maintainResumeRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.updateResume(request, maintainResumeRequestDTO);
		return response;
	}

	@GetMapping("user/getResume")
	@ApiOperation(value = "This Api is used to Get Resume Detail")
	public StandardResponse<Resume> getResume(HttpServletRequest request,
											  @RequestParam(name = "userId", required = false) Long userId) {
		StandardResponse<Resume> response = new StandardResponse<Resume>();
		response.setResponseOK();
		response.setData(userService.getResume(request, userId));
		return response;
	}

	@Autowired
	SMSService smsService;

	@PostMapping("user/sendSMSOTP")
	@ApiOperation(value = "This API is used to sendSMS")
	public StandardResponse<String> sendSMSOTP(HttpServletRequest request) {
		StandardResponse<String> response = new StandardResponse<String>();
		response.setResponseOK();
		response.setData(smsService.sendotp("+918904576043"));
		return response;
	}

	@PostMapping("user/reSendSMSOTP")
	@ApiOperation(value = "This API is used to sendSMS")
	public StandardResponse<String> reSendSMSOTP(HttpServletRequest request) {
		StandardResponse<String> response = new StandardResponse<String>();
		response.setResponseOK();
		response.setData(smsService.resendOtp("+918904576043"));
		return response;
	}

	@PostMapping("user/verifySMSOTP")
	@ApiOperation(value = "This API is used to sendSMS")
	public StandardResponse<String> sendSMSOTP(@RequestBody OTPVerificationRequestDTO otpRequest) {
		StandardResponse<String> response = new StandardResponse<String>();
		response.setResponseOK();
		response.setData(smsService.verifyOtp("+918904576043", otpRequest.getMobileOTP()));
		return response;
	}

	@GetMapping("user/getCareerAppliedList")
	@ApiOperation(value = "This API is used to get List of User Applied")
	public StandardResponse<List<CareerAppliedDTO>> getCareerAppliedList(HttpServletRequest request,
																		 @RequestParam(name = "documentTypeEnum", required = true) DocumentTypeEnum documentTypeEnum,
																		 @RequestParam(name = "status", required = false) String status,
																		 @RequestParam(name = "id", required = true) Long id, @RequestParam(defaultValue = "0") int page,
																		 @RequestParam(defaultValue = "10") int size) {
		StandardResponse<List<CareerAppliedDTO>> response = new StandardResponse<List<CareerAppliedDTO>>();
		response.setResponseOK();
		response.setData(userService.getCareerAppliedList(request, documentTypeEnum, id, status, page, size));
		return response;
	}

	@PostMapping("user/careerApprove")
	@ApiOperation(value = "This API is used to Add New Internship")
	public BasicResponse careerApprove(HttpServletRequest request,
									   @RequestBody CareerApproveRequestDTO careerApproveRequestDTO) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.careerApprove(request, careerApproveRequestDTO);
		return response;
	}

	@PutMapping("user/updateWelcomeScreen")
	@ApiOperation(value = "This API is used to update welcome screen shown status")
	public BasicResponse updateWelcomeScreen(HttpServletRequest request) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		userService.updateWelcomeScreen(request);
		return response;
	}

	@GetMapping("user/searchUsersByEmail")
	public StandardResponse<java.util.List<EmailSuggestionDTO>> searchUsersByEmail(@RequestParam String query) {
		StandardResponse<java.util.List<EmailSuggestionDTO>> response = new StandardResponse<>();
		response.setResponseOK();
		response.setData(userService.searchUsersByEmail(query));
		return response;
	}

	@GetMapping("user/searchUsersByName")
	public StandardResponse<java.util.List<EmailSuggestionDTO>> searchUsersByName(@RequestParam String query) {
		StandardResponse<java.util.List<EmailSuggestionDTO>> response = new StandardResponse<>();
		response.setResponseOK();
		response.setData(userService.searchUsersByName(query));
		return response;
	}

	@PutMapping("user/updateProfilePhoto")
	public BasicResponse updateProfilePhoto(HttpServletRequest request, @RequestBody ProfilePhotoDTO profilePhotoDTO) {
		userService.updateProfilePhoto(request, profilePhotoDTO);
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		return response;
	}

}
