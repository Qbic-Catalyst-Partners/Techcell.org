package com.simtech.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.simtech.dao.CareerRepository;
import com.simtech.dao.CareerTagRepository;
import com.simtech.dao.CertificationRepository;
import com.simtech.dao.InternshipRepository;
import com.simtech.dao.JobRepository;
import com.simtech.dao.PostingRepository;
import com.simtech.dao.PostingTagRepository;
import com.simtech.dao.ProjectRepository;
import com.simtech.dao.SoftwareRepository;
import com.simtech.dao.SoftwareTagRepository;
import com.simtech.dao.UserRepository;
import com.simtech.dto.CertificationRequestDTO;
import com.simtech.dto.InternshipRequestDTO;
import com.simtech.dto.JobRequestDTO;
import com.simtech.dto.PostBaseRequestDTO;
import com.simtech.dto.PostSoftwareRequestDTO;
import com.simtech.dto.ProjectRequestDTO;
import com.simtech.dto.constant.DocumentTypeEnum;
import com.simtech.dto.constant.ObjectStatus;
import com.simtech.entity.Career;
import com.simtech.entity.CareerTag;
import com.simtech.entity.Certification;
import com.simtech.entity.HashTag;
import com.simtech.entity.Internship;
import com.simtech.entity.Job;
import com.simtech.entity.Posting;
import com.simtech.entity.PostingTag;
import com.simtech.entity.Project;
import com.simtech.entity.Software;
import com.simtech.entity.SoftwareTag;
import com.simtech.entity.UserDetail;
import com.simtech.handler.PostingHandler;
import com.simtech.handler.PostingHandlerProvider;
import com.simtech.service.ContentPostService;
import com.simtech.service.NotificationService;
import com.simtech.exception.BusinessException;

@Service
public class ContentPostServiceImpl<T extends PostBaseRequestDTO> implements ContentPostService<T> {

	private static final Logger logger = LoggerFactory.getLogger(ContentPostServiceImpl.class);

	@Autowired
	PostingRepository postingRepository;

	@Autowired
	PostingTagRepository postingTagRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	SoftwareRepository softwareRepository;
	@Autowired
	InternshipRepository internshipRepository;
	@Autowired
	ProjectRepository projectRepository;
	@Autowired
	JobRepository jobRepository;
	@Autowired
	SoftwareTagRepository softWareTagRepository;

	@Autowired
	CareerTagRepository careerTagRepository;

	@Autowired
	CareerRepository careerRepository;

	@Autowired
	CertificationRepository certificationRepository;

	@Autowired
	PostingHandlerProvider handlerProvider;

	@Autowired
	NotificationService notificationService;

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public String createPost(HttpServletRequest request, T post) {

		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		String role = request.getAttribute("role").toString();
		validate(post);
		Posting posting = generatePostingObject(role, userId, post);

		PostingHandler<T> handler = (PostingHandler<T>) handlerProvider.getPostingHandler(post.getPostType());
		handler.validate(posting, post);

		handler.beforeProcess(posting, post);

		process(post, posting);

		handler.afterProcess(posting, post);

		// Return any info message produced by the handler (Community posts)
		if (post instanceof com.simtech.dto.PostCommunityRequestDTO) {
			return com.simtech.handler.CommunityPostingHandlerImpl.getAndClearMessage();
		}

		return null;
	}

	private void process(T post, Posting posting) {
		logger.info("Processing post with ID: {}", posting.getId());
		postingRepository.save(posting);
		List<PostingTag> postingTags = new ArrayList<>();
		
		// Add primary tag if exists
		if (post.getPrimaryTag() != null) {
			logger.info("Adding primary tag: {}", post.getPrimaryTag());
			PostingTag primaryTag = new PostingTag();
			primaryTag.setHashTag(new HashTag(post.getPrimaryTag()));
			primaryTag.setPosting(posting);
			primaryTag.setIsPrimary(true);
			postingTags.add(primaryTag);
		} else {
			logger.warn("No primary tag found for post: {}", posting.getId());
		}
		
		// Add secondary tags if exist
		if (post.getTags() != null && !post.getTags().isEmpty()) {
			logger.info("Adding {} secondary tags", post.getTags().size());
			postingTags.addAll(post.getTags().stream().map(tagId -> {
				PostingTag postingTag = new PostingTag();
				postingTag.setHashTag(new HashTag(tagId));
				postingTag.setPosting(posting);
				postingTag.setIsPrimary(false);
				return postingTag;
			}).collect(Collectors.toList()));
		} else {
			logger.info("No secondary tags found for post: {}", posting.getId());
		}
		
		if (!postingTags.isEmpty()) {
			logger.info("Saving {} tags for post: {}", postingTags.size(), posting.getId());
			postingTags = postingTagRepository.saveAll(postingTags);
			logger.info("Successfully saved {} tags", postingTags.size());
		} else {
			logger.warn("No tags to save for post: {}", posting.getId());
		}

		// Send notifications if post is approved immediately
		if (ObjectStatus.APPROVED.getCode().equals(posting.getObjectStatus())) {
			List<Long> tagIds = postingTags.stream()
					.map(pt -> pt.getHashTag().getId())
					.collect(Collectors.toList());

			String actorName = posting.getPostedUser().getFirstName() + " " + posting.getPostedUser().getLastName();
			// Safely handle null titles to avoid NullPointerException
			String safeTitle = posting.getTitle() != null ? posting.getTitle().replace("\"", "'") : "";
			String extraJson = String.format("{\"actorUserName\":\"%s\",\"title\":\"%s\"}",
					actorName.replace("\"", "'"),
					safeTitle);

			notificationService.createNotificationsForTags(
					posting.getPostedUser().getUserId(),
					tagIds,
					"CREATE",
					posting.getPostType(),
					posting.getId(),
					extraJson);
		}
	}

	private Posting generatePostingObject(String role, Long userId, T post) {
		Long zeroLong = Long.valueOf(0);
		Posting posting = new Posting();
		posting.setTitle(post.getTitle());
		posting.setPostType(post.getPostType().getCode());
		posting.setShortDescription(post.getShortDescription());
		posting.setComments(zeroLong);
		posting.setLikes(zeroLong);
		
		// Get complete user details from repository
		UserDetail user = userRepository.findByUserId(userId);
		if (user == null) {
			throw new BusinessException("User not found");
		}
		posting.setPostedUser(user);
		
		posting.setCreatedDate(new Date());
		posting.setUpdateddDate(new Date());
		posting.setViews(zeroLong);
		posting.setStatus("Active");
		posting.setObjectStatus(
				role.equalsIgnoreCase("Student") || role.equalsIgnoreCase("Faculty") || role.equalsIgnoreCase("Corporate")
				? ObjectStatus.PENDING_APPROVED.getCode()
				: ObjectStatus.APPROVED.getCode());
		return posting;
	}

	private void validate(T post) {
		// TODO Auto-generated method stub

	}

	@Override
	@Transactional
	public void addSoftware(HttpServletRequest request, PostSoftwareRequestDTO postSoftwareRequestDTO) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		String role = request.getAttribute("role").toString();
		Software softwate = generateSoftwareObject(role, userId, postSoftwareRequestDTO);
		softwareRepository.save(softwate);
		List<SoftwareTag> softwareTags = generateHashTagObject(softwate, postSoftwareRequestDTO.getPrimaryTag(),
				postSoftwareRequestDTO.getTags());
		softWareTagRepository.saveAll(softwareTags);

		// Notify users about new software
		List<Long> tagIds = softwareTags.stream()
				.map(st -> st.getHashTag().getId())
				.collect(Collectors.toList());

		UserDetail actor = userRepository.findById(userId).orElse(null);
		if (actor != null) {
			String actorName = actor.getFirstName() + " " + actor.getLastName();
			String extraJson = String.format("{\"actorUserName\":\"%s\",\"title\":\"%s\"}",
					actorName.replace("\\\"", "'"),
					softwate.getSoftwareName() != null ? softwate.getSoftwareName().replace("\\\"", "'") : "Software");

			notificationService.createNotificationsForTags(
					actor.getUserId(),
					tagIds,
					"CREATE",
					DocumentTypeEnum.SOFTWARE.getCode(),
					softwate.getId(),
					extraJson);
		}
	}

	private Software generateSoftwareObject(String role, Long userId, PostSoftwareRequestDTO postSoftwareRequestDTO) {
		Software softwate = new Software();
		softwate.setCreatedDate(new Date());
		softwate.setUpdateddDate(new Date());
		softwate.setLicenceType(postSoftwareRequestDTO.getLicenceType());
		softwate.setOsSupported(postSoftwareRequestDTO.getOsSupported());
		softwate.setReleaseDate(postSoftwareRequestDTO.getReleaseDate());
		softwate.setSoftwarelink(postSoftwareRequestDTO.getSoftwarelink());
		softwate.setSoftwareName(postSoftwareRequestDTO.getSoftwareName());
		softwate.setThumbnail(postSoftwareRequestDTO.getThumbnail());
		softwate.setUserDetail(new UserDetail(userId));
		softwate.setVersion(postSoftwareRequestDTO.getVersion());
		softwate.setStatus(
				role.equalsIgnoreCase("Student") || role.equalsIgnoreCase("Faculty") ? "Inactive" : "Active");
		return softwate;
	}

	private List<SoftwareTag> generateHashTagObject(Software software, Long primaryTag, List<Long> tags) {

		List<SoftwareTag> targetList = new ArrayList<SoftwareTag>();
		if (tags != null) {
			List<SoftwareTag> secondaryTags = tags.stream().map(source -> {
				SoftwareTag postingTag = new SoftwareTag();
				postingTag.setHashTag(new HashTag(source));
				postingTag.setSoftware(software);
				postingTag.setIsPrimary(false);
				return postingTag;
			}).collect(Collectors.toList());
			targetList.addAll(secondaryTags);
		}
		if (primaryTag != null) {
			SoftwareTag postingTag = new SoftwareTag();
			postingTag.setHashTag(new HashTag(primaryTag));
			postingTag.setSoftware(software);
			postingTag.setIsPrimary(true);
			targetList.add(postingTag);
		}
		return targetList;

	}

	@Override
	public void addInternship(HttpServletRequest request, InternshipRequestDTO internshipRequestDTO) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		String role = request.getAttribute("role").toString();
		Internship internship = generateInternshipObject(role, userId, internshipRequestDTO);
		internshipRepository.save(internship);
		List<CareerTag> careerTags = generateHashTagObject(internshipRequestDTO.getTags(), internship, null, null, null);
		careerTagRepository.saveAll(careerTags);
		Career career = new Career();
		career.setInternship(internship);
		career.setCreatedDate(new Date());
		career.setCareerType(DocumentTypeEnum.INTERNSHIP.getCode());
		career.setStatus("Active");
		careerRepository.save(career);

		// Notify
		List<Long> tagIds = careerTags.stream().map(ct -> ct.getHashTag().getId()).collect(Collectors.toList());
		UserDetail actor = userRepository.findById(userId).orElse(null);
		if (actor != null) {
			String actorName = actor.getFirstName() + " " + actor.getLastName();
			String extraJson = String.format("{\"actorUserName\":\"%s\",\"title\":\"%s\"}",
					actorName.replace("\\\"", "'"),
					internship.getTitle().replace("\\\"", "'"));

			notificationService.createNotificationsForTags(actor.getUserId(), tagIds, "CREATE", DocumentTypeEnum.INTERNSHIP.getCode(), internship.getId(), extraJson);
		}
	}

	private Internship generateInternshipObject(String role, Long userId, InternshipRequestDTO internshipRequestDTO) {
		Internship internship = new Internship();
		internship.setCompanyDesc(internshipRequestDTO.getCompanyDesc());
		internship.setCompanyLogo(internshipRequestDTO.getCompanyLogo());
		internship.setCompanyName(internshipRequestDTO.getCompanyName());
		internship.setContactNo(internshipRequestDTO.getContactNo());
		internship.setCoverPage(internshipRequestDTO.getCoverPage());
		internship.setCreatedBy(new UserDetail(userId));
		internship.setCreatedDate(new Date());
		internship.setDesc(internshipRequestDTO.getDesc());
		internship.setDuration(internshipRequestDTO.getDuration());
		internship.setDurationUnit(internshipRequestDTO.getDurationUnit());
		internship.setEmail(internshipRequestDTO.getEmail());
		internship.setEndDate(internshipRequestDTO.getEndDate());
		internship.setLocation(internshipRequestDTO.getLocation());
		internship.setQualification(internshipRequestDTO.getQualification());
		internship.setStartDate(internshipRequestDTO.getStartDate());
		internship.setStipend(internshipRequestDTO.getStipend());
		internship.setTitle(internshipRequestDTO.getTitle());
		internship.setUpdateddDate(new Date());
		internship.setSkills(internshipRequestDTO.getSkills());
		internship.setStatus(role.equalsIgnoreCase("Student") || role.equalsIgnoreCase("Faculty") ? "Inactive" : "Active");
		return internship;
	}

	@Override
	public void addProject(HttpServletRequest request, ProjectRequestDTO internshipRequestDTO) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		String role = request.getAttribute("role").toString();
		Project project = generateProjectObject(role, userId, internshipRequestDTO);
		projectRepository.save(project);
		List<CareerTag> careerTags = generateHashTagObject(internshipRequestDTO.getTags(), null, null, project, null);
		careerTagRepository.saveAll(careerTags);
		Career career = new Career();
		career.setProject(project);
		career.setCreatedDate(new Date());
		career.setCareerType(DocumentTypeEnum.PROJECT.getCode());
		career.setStatus("Active");
		careerRepository.save(career);

		// Notify
		List<Long> pjTagIds = careerTags.stream().map(ct -> ct.getHashTag().getId()).collect(Collectors.toList());
		UserDetail pjActor = userRepository.findById(userId).orElse(null);
		if (pjActor != null) {
			String actorName = pjActor.getFirstName() + " " + pjActor.getLastName();
			String extraJson = String.format("{\"actorUserName\":\"%s\",\"title\":\"%s\"}",
					actorName.replace("\\\"", "'"),
					project.getTitle().replace("\\\"", "'"));

			notificationService.createNotificationsForTags(pjActor.getUserId(), pjTagIds, "CREATE", DocumentTypeEnum.PROJECT.getCode(), project.getId(), extraJson);
		}
	}

	private Project generateProjectObject(String role, Long userId, ProjectRequestDTO internshipRequestDTO) {
		Project project = new Project();
		project.setCompanyDesc(internshipRequestDTO.getCompanyDesc());
		project.setCompanyLogo(internshipRequestDTO.getCompanyLogo());
		project.setCompanyName(internshipRequestDTO.getCompanyName());
		project.setContactNo(internshipRequestDTO.getContactNo());
		project.setCoverPage(internshipRequestDTO.getCoverPage());
		project.setCreatedBy(new UserDetail(userId));
		project.setCreatedDate(new Date());
		project.setDesc(internshipRequestDTO.getDesc());
		project.setEmail(internshipRequestDTO.getEmail());
		project.setEndDate(internshipRequestDTO.getEndDate());
		project.setStartDate(internshipRequestDTO.getStartDate());
		project.setTitle(internshipRequestDTO.getTitle());
		project.setUpdateddDate(new Date());
		project.setSkills(internshipRequestDTO.getSkills());
		project.setTeamCount(internshipRequestDTO.getTeamCount());
		project.setTeamSize(internshipRequestDTO.getTeamSize());
		project.setDuration(internshipRequestDTO.getDuration());
		project.setDurationUnit(internshipRequestDTO.getDurationUnit());
		project.setStatus(role.equalsIgnoreCase("Student") || role.equalsIgnoreCase("Faculty") ? "Inactive" : "Active");
		return project;
	}

	private List<CareerTag> generateHashTagObject(List<Long> tags, Internship internship, Job job, Project project,
			Certification certification) {
		List<CareerTag> targetList = tags.stream().map(source -> {
			CareerTag postingTag = new CareerTag();
			postingTag.setHashTag(new HashTag(source));
			postingTag.setInternship(internship);
			postingTag.setProject(project);
			postingTag.setJob(job);
			postingTag.setCertification(certification);
			postingTag.setIsPrimary(false);
			return postingTag;
		}).collect(Collectors.toList());

		return targetList;
	}

	private Certification generateCertificateObject(String role, Long userId,
			CertificationRequestDTO certificationRequestDTO) {
		Certification certification = new Certification();
		certification.setCertFee(certificationRequestDTO.getCertFee());
		certification.setCertLogo(certificationRequestDTO.getCertLogo());
		certification.setContactNo(certificationRequestDTO.getContactNo());
		certification.setCoverPage(certificationRequestDTO.getCoverPage());
		certification.setCreatedBy(new UserDetail(userId));
		certification.setCreatedDate(new Date());
		certification.setDesc(certificationRequestDTO.getDesc());
		certification.setDuration(certificationRequestDTO.getDuration());
		certification.setDurationUnit(certificationRequestDTO.getDurationUnit());
		certification.setEligibility(certificationRequestDTO.getEligibility());
		certification.setEmail(certificationRequestDTO.getEmail());
		certification.setEndDate(certificationRequestDTO.getEndDate());
		certification.setField(certificationRequestDTO.getField());
		certification.setMode(certificationRequestDTO.getMode());
		certification.setStartDate(
				certificationRequestDTO.getStartDate() == null ? new Date() : certificationRequestDTO.getStartDate());
		certification.setTitle(certificationRequestDTO.getTitle());
		certification.setStatus(
				role.equalsIgnoreCase("Student") || role.equalsIgnoreCase("Faculty") ? "Inactive" : "Active");
		return certification;
	}

	@Override
	public void addJob(HttpServletRequest request, JobRequestDTO jobRequestDTO) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		String role = request.getAttribute("role").toString();
		Job job = generateJobObject(role, userId, jobRequestDTO);
		jobRepository.save(job);
		List<CareerTag> careerTags = generateHashTagObject(jobRequestDTO.getTags(), null, job, null, null);
		careerTagRepository.saveAll(careerTags);
		Career career = new Career();
		career.setJob(job);
		career.setCreatedDate(new Date());
		career.setCareerType(DocumentTypeEnum.JOB.getCode());
		career.setStatus("Active");
		careerRepository.save(career);

		// Notify
		List<Long> jobTagIds = careerTags.stream().map(ct -> ct.getHashTag().getId()).collect(Collectors.toList());
		UserDetail jobActor = userRepository.findById(userId).orElse(null);
		if (jobActor != null) {
			String actorName = jobActor.getFirstName() + " " + jobActor.getLastName();
			String extraJson = String.format("{\"actorUserName\":\"%s\",\"title\":\"%s\"}",
					actorName.replace("\\\"", "'"),
					job.getDesignation().replace("\\\"", "'"));

			notificationService.createNotificationsForTags(jobActor.getUserId(), jobTagIds, "CREATE", DocumentTypeEnum.JOB.getCode(), job.getId(), extraJson);
		}
	}

	private Job generateJobObject(String role, Long userId, JobRequestDTO jobRequestDTO) {
		Job job = new Job();
		job.setCompanyDesc(jobRequestDTO.getCompanyDesc());
		job.setCompanyLogo(jobRequestDTO.getCompanyLogo());
		job.setCompanyName(jobRequestDTO.getCompanyName());
		job.setContactNo(jobRequestDTO.getCompanyName());
		job.setCoverPage(jobRequestDTO.getCoverPage());
		job.setCreatedBy(new UserDetail(userId));
		job.setCreatedDate(new Date());
		job.setDesc(jobRequestDTO.getDesc());
		job.setExperiance(jobRequestDTO.getExperiance());
		job.setExperianceUnit(jobRequestDTO.getExperianceUnit());
		job.setEmail(jobRequestDTO.getEmail());
		job.setEndDate(jobRequestDTO.getEndDate());
		job.setLocation(jobRequestDTO.getLocation());
		job.setQualification(jobRequestDTO.getQualification());
		job.setStartDate(jobRequestDTO.getStartDate());
		job.setCtc(jobRequestDTO.getCtc());
		job.setCtcTo(jobRequestDTO.getCtcTo());
		job.setDesignation(jobRequestDTO.getDesignation());
		job.setUpdatedDate(new Date());
		job.setJobType(jobRequestDTO.getJobType());
		job.setSkills(jobRequestDTO.getSkills());
		job.setStatus(role.equalsIgnoreCase("Student") || role.equalsIgnoreCase("Faculty") ? "Inactive" : "Active");
		return job;

	}

	@Override
	public void addCertification(HttpServletRequest request, CertificationRequestDTO certificationRequestDTO) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		String role = request.getAttribute("role").toString();
		Certification certification = generateCertificateObject(role, userId, certificationRequestDTO);
		certificationRepository.save(certification);
		List<CareerTag> careerTags = generateHashTagObject(certificationRequestDTO.getTags(), null, null, null,
				certification);
		careerTagRepository.saveAll(careerTags);
		Career career = new Career();
		career.setCertification(certification);
		career.setCreatedDate(new Date());
		career.setCareerType(DocumentTypeEnum.CERTIFICATION.getCode());
		career.setStatus("Active");
		careerRepository.save(career);

		// Notify
		List<Long> certTagIds = careerTags.stream().map(ct -> ct.getHashTag().getId()).collect(Collectors.toList());
		UserDetail certActor = userRepository.findById(userId).orElse(null);
		if (certActor != null) {
			String actorName = certActor.getFirstName() + " " + certActor.getLastName();
			String extraJson = String.format("{\"actorUserName\":\"%s\",\"title\":\"%s\"}",
					actorName.replace("\\\"", "'"),
					certification.getTitle().replace("\\\"", "'"));

			notificationService.createNotificationsForTags(certActor.getUserId(), certTagIds, "CREATE", DocumentTypeEnum.CERTIFICATION.getCode(), certification.getId(), extraJson);
		}
	}

}
