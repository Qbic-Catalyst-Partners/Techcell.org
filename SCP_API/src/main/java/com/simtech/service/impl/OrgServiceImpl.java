package com.simtech.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.simtech.dao.CareerRepository;
import com.simtech.dao.CareerUserRepository;
import com.simtech.dao.HashTagRepository;
import com.simtech.dao.OrgDetailRepository;
import com.simtech.dao.OrgProgramNameRepository;
import com.simtech.dao.PostingRepository;
import com.simtech.dao.ProgrameNameStremRepository;
import com.simtech.dao.SecurityQuestionRepository;
import com.simtech.dao.SoftwareRepository;
import com.simtech.dao.UserDocumentRepository;
import com.simtech.dao.UserRepository;
import com.simtech.dto.CareerResponseDTO;
import com.simtech.dto.CertificationResponseDTO;
import com.simtech.dto.InternshipResponseDTO;
import com.simtech.dto.JobResponseDTO;
import com.simtech.dto.OrgDetailResponseDTO;
import com.simtech.dto.ProjectResponseDTO;
import com.simtech.dto.PostSoftwareResponseDTO;
import com.simtech.dto.PostingResponseDTO;
import com.simtech.dto.UserDocumentRequestDTO;
import com.simtech.dto.constant.DocumentTypeEnum;
import com.simtech.dto.constant.ObjectStatus;
import com.simtech.entity.Career;
import com.simtech.entity.CareerUser;
import com.simtech.entity.Certification;
import com.simtech.entity.HashTag;
import com.simtech.entity.Internship;
import com.simtech.entity.Job;
import com.simtech.entity.OrgDetail;
import com.simtech.entity.OrgProgramRelationship;
import com.simtech.entity.Posting;
import com.simtech.entity.ProgramName;
import com.simtech.entity.ProgramStreamRelationship;
import com.simtech.entity.SecurityQuestion;
import com.simtech.entity.Software;
import com.simtech.entity.Stream;
import com.simtech.entity.UserDocument;
import com.simtech.service.OrgService;
import com.simtech.service.helper.DataLoadFileParser;
import com.simtech.service.helper.OrgServiceHelper;
import com.simtech.service.helper.UserDocumentHelper;
import com.simtech.service.helper.UserServiceHelper;

@Service
public class OrgServiceImpl implements OrgService {

	@Autowired
	OrgServiceHelper orgServiceHelper;
	@Autowired
	UserDocumentHelper userDocumentHelper;

	@Autowired
	OrgDetailRepository orgDetailRepository;

	@Autowired
	UserDocumentRepository userDocumentRepository;

	@Autowired
	DataLoadFileParser orgDetailFileParser;

	@Autowired
	SecurityQuestionRepository securityQuestionRepository;
	@Autowired
	HashTagRepository hashTagRepository;

	@Autowired
	OrgProgramNameRepository orgProgramNameRepository;

	@Autowired
	ProgrameNameStremRepository programeNameStremRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	PostingRepository postingRepository;

	@Autowired
	UserServiceHelper userServiceHelper;

	@Autowired
	SoftwareRepository softwareRepository;

	@Autowired
	CareerRepository careerRepository;

	@Autowired
	CareerUserRepository careerUserRepository;

	public OrgDetailResponseDTO getOrgDetailById(Long orgId) {
		OrgDetail orgDetail = orgDetailRepository.findByOrgId(orgId);
		OrgDetailResponseDTO result = orgServiceHelper.setOrgDetailResponseDTO(orgDetail);
		return result;
	}

	@Override
	public List<OrgDetailResponseDTO> listOrgdetailByname(String orgName) {
		List<OrgDetail> orgDetails = orgDetailRepository.findByOrgNameContaining(orgName);
		List<OrgDetailResponseDTO> result = orgServiceHelper.generateDTOForOrgDetailResp(orgDetails);
		return result;
	}

	@Override
	public List<ProgramName> listProgramNameByOrgId(Long orgId) {
		List<OrgProgramRelationship> orgProgramRelationships = orgProgramNameRepository.findByOrgDetailOrgId(orgId);
		List<ProgramName> result = orgServiceHelper.generateProgramNameResp(orgProgramRelationships);
		return result;
	}

	@Override
	public void uploadDocuments(List<UserDocumentRequestDTO> documentRequestDTO) {
		List<UserDocument> userDocs = userDocumentHelper.generateDTOForUserDocRequest(documentRequestDTO);
		userDocumentRepository.saveAll(userDocs);
	}

	@Override
	public List<SecurityQuestion> listSecurityQuestions() {
		return securityQuestionRepository.findAll();
	}

	@Override
	public List<HashTag> getHashTagList(String tagName) {
		return hashTagRepository.findByTextContaining(tagName);
	}

	@Override
	public List<Stream> listStream(Long orgId, Long programId) {
		List<ProgramStreamRelationship> programStreamRelationships = programeNameStremRepository
				.findByOrgDetailOrgIdAndProgramNameId(orgId, programId);
		List<Stream> result = orgServiceHelper.generateStreamResp(programStreamRelationships);
		return result;
	}

	@Override
	public Map<String, Long> getCounts() {
		Map<String, Long> result = new HashMap<String, Long>();
		Long institutionCount = orgDetailRepository.count();
		Long moderatorCount = userRepository.countByRole("Moderator");
		Long studentCount = userRepository.countByRole("Student");
		Long communityCount = postingRepository.countByPostType(DocumentTypeEnum.COMMUNITY.getCode());
		Long careerCount = careerRepository.countByStatus("Active");

		result.put("institutionCount", institutionCount);
		result.put("moderatorCount", moderatorCount);
		result.put("studentCount", studentCount);
		result.put("communityCount", communityCount);
		result.put("careerCount", careerCount);
		return result;
	}

	@Override
	public Map<String, Object> getLatestPosting() {
		int page = 0;
		int size = 1; // This ensures only one post per entity
		Pageable pageable = PageRequest.of(page, size);

		// Get latest video
		List<Posting> videoList = postingRepository.findByObjectStatusAndPostTypeAndStatusOrderByCreatedDateDesc(
				ObjectStatus.APPROVED.getCode(), DocumentTypeEnum.VIDEOS.getCode(), "Active", pageable);
		List<PostingResponseDTO> videoResponseList = userServiceHelper.generatePostingResponseDTOs(videoList);

		// Get latest blog
		List<Posting> blog = postingRepository.findByObjectStatusAndPostTypeAndStatusOrderByCreatedDateDesc(
				ObjectStatus.APPROVED.getCode(), DocumentTypeEnum.BLOGS.getCode(), "Active", pageable);
		List<PostingResponseDTO> blogResponse = userServiceHelper.generatePostingResponseDTOs(blog);

		// Get latest community
		List<Posting> community = postingRepository.findByObjectStatusAndPostTypeAndStatusOrderByCreatedDateDesc(
				ObjectStatus.APPROVED.getCode(), DocumentTypeEnum.COMMUNITY.getCode(), "Active", pageable);
		List<PostingResponseDTO> communityResponse = userServiceHelper.generatePostingResponseDTOs(community);

		// Get latest software
		Page<Software> softwarePage = softwareRepository.findByStatusOrderByCreatedDateDesc("Active", pageable);
		List<Software> softwareList = softwarePage.getContent();
		List<PostSoftwareResponseDTO> softwareResponseDTOs = userServiceHelper
				.generatePostSoftwareResponseDTOs(softwareList);
		
		// Get latest careers
		int pageCareers = 0;
		int sizeCareers = 10; // Increased from 1 to 10 to get more career records
		Pageable pageableCareers = PageRequest.of(pageCareers, sizeCareers);
		
		List<Career> careers = careerRepository.findAllByStatusOrderByCreatedDateDesc("Active", pageableCareers);
		
		CareerResponseDTO careerResponseDTO = new CareerResponseDTO();
		
		// Process each career to find the latest of each type
		for (Career career : careers) {
			// Handle Internship
			if (career.getInternship() != null && careerResponseDTO.getInternshipResponseDTO() == null) {

				List<CareerUser> careerUsers = careerUserRepository.findByCareerInternshipIn(Collections.singletonList(career.getInternship()));

				List<InternshipResponseDTO> internshipResponseDTOs = userServiceHelper.generateInternshipResponse(
					Collections.singletonList(career.getInternship()), 
					careerUsers,
					careerUsers
				);
				if (!internshipResponseDTOs.isEmpty()) {
					careerResponseDTO.setInternshipResponseDTO(internshipResponseDTOs.get(0));
				} 
			}
			
			// Handle Job - Case insensitive comparison
			if (careerResponseDTO.getJobResponseDTO() == null && 
				DocumentTypeEnum.JOB.getCode().equalsIgnoreCase(career.getCareerType())) {
				// Get the job from the career
				Job job = career.getJob();
				if (job != null) {
					List<CareerUser> careerUsers = careerUserRepository.findByCareerJobIn(Collections.singletonList(job));
					List<JobResponseDTO> jobResponseDTOs = userServiceHelper.generateJobResponse(
						Collections.singletonList(job),
						careerUsers,
						careerUsers
					);
					if (!jobResponseDTOs.isEmpty()) {
						careerResponseDTO.setJobResponseDTO(jobResponseDTOs.get(0));
					}
				}
			}
			
			// Handle Project
			if (career.getProject() != null && careerResponseDTO.getProjectResponseDTO() == null) {

				List<CareerUser> careerUsers = careerUserRepository.findByCareerProjectIn(Collections.singletonList(career.getProject()));
				List<ProjectResponseDTO> projectResponseDTOs = userServiceHelper.generateProjectResponse(
					Collections.singletonList(career.getProject()),
					careerUsers,
					careerUsers
				);
				if (!projectResponseDTOs.isEmpty()) {
					careerResponseDTO.setProjectResponseDTO(projectResponseDTOs.get(0));
				} 
			}
			
			// Handle Certification
			if (career.getCertification() != null && careerResponseDTO.getCertificationResponseDTO() == null) {
	
				List<CareerUser> careerUsers = careerUserRepository.findByCareerCertificationIn(Collections.singletonList(career.getCertification()));

				List<CertificationResponseDTO> certificationResponseDTOs = userServiceHelper.generateCertificationResponse(
					Collections.singletonList(career.getCertification()),
					careerUsers,
					careerUsers
				);
				if (!certificationResponseDTOs.isEmpty()) {
					careerResponseDTO.setCertificationResponseDTO(certificationResponseDTOs.get(0));
				}
			}
		}

		Map<String, Object> result = new HashMap<String, Object>();
		
		// Add only the first (latest) post from each category to the result
		if (videoResponseList.size() > 0) {
			result.put("video", videoResponseList.get(0));
		}
		if (blogResponse.size() > 0) {
			result.put("blog", blogResponse.get(0));
		}
		if (communityResponse.size() > 0) {
			result.put("community", communityResponse.get(0));
		}
		if (softwareResponseDTOs.size() > 0) {
			result.put("software", softwareResponseDTOs.get(0));
		}
		result.put("career", careerResponseDTO);
		
		return result;
	}

}
