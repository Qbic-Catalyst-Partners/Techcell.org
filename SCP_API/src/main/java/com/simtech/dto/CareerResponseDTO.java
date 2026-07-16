package com.simtech.dto;

public class CareerResponseDTO {
	private InternshipResponseDTO internshipResponseDTO;
	private JobResponseDTO jobResponseDTO;
	private ProjectResponseDTO projectResponseDTO;
	private CertificationResponseDTO certificationResponseDTO;

	public InternshipResponseDTO getInternshipResponseDTO() {
		return internshipResponseDTO;
	}

	public void setInternshipResponseDTO(InternshipResponseDTO internshipResponseDTO) {
		this.internshipResponseDTO = internshipResponseDTO;
	}

	public JobResponseDTO getJobResponseDTO() {
		return jobResponseDTO;
	}

	public void setJobResponseDTO(JobResponseDTO jobResponseDTO) {
		this.jobResponseDTO = jobResponseDTO;
	}

	public ProjectResponseDTO getProjectResponseDTO() {
		return projectResponseDTO;
	}

	public void setProjectResponseDTO(ProjectResponseDTO projectResponseDTO) {
		this.projectResponseDTO = projectResponseDTO;
	}

	public CertificationResponseDTO getCertificationResponseDTO() {
		return certificationResponseDTO;
	}

	public void setCertificationResponseDTO(CertificationResponseDTO certificationResponseDTO) {
		this.certificationResponseDTO = certificationResponseDTO;
	}
}
