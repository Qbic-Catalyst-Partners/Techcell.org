package com.simtech.service;

import java.util.List;
import java.util.Map;

import com.simtech.dto.OrgDetailResponseDTO;
import com.simtech.dto.UserDocumentRequestDTO;
import com.simtech.entity.HashTag;
import com.simtech.entity.ProgramName;
import com.simtech.entity.SecurityQuestion;
import com.simtech.entity.Stream;

public interface OrgService {

	public OrgDetailResponseDTO getOrgDetailById(Long orgId);

	public List<OrgDetailResponseDTO> listOrgdetailByname(String orgName);

	public void uploadDocuments(List<UserDocumentRequestDTO> documentRequestDTO);

	public List<SecurityQuestion> listSecurityQuestions();

	public List<HashTag> getHashTagList(String tagName);

	List<ProgramName> listProgramNameByOrgId(Long orgId);

	public List<Stream> listStream(Long orgId, Long programId);

	public Map<String, Long> getCounts();

	Map<String, Object> getLatestPosting();
}
