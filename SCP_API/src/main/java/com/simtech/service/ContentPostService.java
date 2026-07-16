package com.simtech.service;

import javax.servlet.http.HttpServletRequest;

import com.simtech.dto.CertificationRequestDTO;
import com.simtech.dto.InternshipRequestDTO;
import com.simtech.dto.JobRequestDTO;
import com.simtech.dto.PostSoftwareRequestDTO;
import com.simtech.dto.ProjectRequestDTO;

public interface ContentPostService<T> {

	/**
	 * Creates a new post of any supported type. For community posts it may also
	 * return a human-readable information message (e.g., moderator migration
	 * details) that the caller can surface to the end-user. For other post
	 * types the method returns {@code null}.
	 */
	String createPost(HttpServletRequest request, T post);

	void addSoftware(HttpServletRequest request, PostSoftwareRequestDTO postSoftwareRequestDTO);

	void addInternship(HttpServletRequest request, InternshipRequestDTO internshipRequestDTO);

	void addJob(HttpServletRequest request, JobRequestDTO jobRequestDTO);

	void addProject(HttpServletRequest request, ProjectRequestDTO internshipRequestDTO);

	void addCertification(HttpServletRequest request, CertificationRequestDTO certificationRequestDTO);
}
