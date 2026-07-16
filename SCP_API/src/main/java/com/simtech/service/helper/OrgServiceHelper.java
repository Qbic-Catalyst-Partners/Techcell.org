package com.simtech.service.helper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.simtech.dto.OrgDetailResponseDTO;
import com.simtech.entity.OrgDetail;
import com.simtech.entity.OrgProgramRelationship;
import com.simtech.entity.ProgramName;
import com.simtech.entity.ProgramStreamRelationship;
import com.simtech.entity.Stream;

@Component
public class OrgServiceHelper {

	public List<OrgDetailResponseDTO> generateDTOForOrgDetailResp(List<OrgDetail> orgDetails) {
		List<OrgDetailResponseDTO> targetList = orgDetails.stream().map(source -> {
			OrgDetailResponseDTO orgDetailResponseDTO = setOrgDetailResponseDTO(source);
			return orgDetailResponseDTO;
		}).collect(Collectors.toList());

		return targetList;
	}

	public OrgDetailResponseDTO setOrgDetailResponseDTO(OrgDetail source) {
		OrgDetailResponseDTO orgDetailResponseDTO = new OrgDetailResponseDTO();
		orgDetailResponseDTO.setOrgId(source.getOrgId());
		orgDetailResponseDTO.setOrgName(source.getOrgName());
		orgDetailResponseDTO.setAICTECode(source.getAICTECode());
		orgDetailResponseDTO.setCity(source.getCity());
		orgDetailResponseDTO.setContactNo(source.getContactNo());
		orgDetailResponseDTO.setOrgAddress(source.getOrgAddress());
		orgDetailResponseDTO.setState(source.getState());
//		List<Stream> stremList = getStremList(source.getOrgStreamRelationships());
//		orgDetailResponseDTO.setStreams(stremList);
		return orgDetailResponseDTO;
	}

	private List<Stream> getStremList(List<OrgProgramRelationship> list) {
		List<Stream> targetList = new ArrayList<Stream>();
//		list.stream().map(source -> {
//			return source.getStream();
//		}).collect(Collectors.toList());
		return targetList;
	}

	public List<ProgramName> generateProgramNameResp(List<OrgProgramRelationship> orgProgramRelationships) {
		List<ProgramName> targetList = orgProgramRelationships.stream().map(source -> {
			return source.getProgram();
		}).collect(Collectors.toList());
		return targetList;
	}

	public List<Stream> generateStreamResp(List<ProgramStreamRelationship> programStreamRelationships) {
		List<Stream> targetList = programStreamRelationships.stream().map(source -> {
			return source.getStream();
		}).collect(Collectors.toList());
		return targetList;
	}

}
