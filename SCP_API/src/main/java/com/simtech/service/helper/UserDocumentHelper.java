package com.simtech.service.helper;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.simtech.dto.UserDocumentRequestDTO;
import com.simtech.dto.UserDocumentResponseDTO;
import com.simtech.dto.constant.DocumentTypeEnum;
import com.simtech.entity.UserDocument;

@Component
public class UserDocumentHelper {

	public List<UserDocument> generateDTOForUserDocRequest(List<UserDocumentRequestDTO> userDocumentRequestDTOs) {
		List<UserDocument> targetList = userDocumentRequestDTOs.stream().map(source -> {
			UserDocument target = new UserDocument();
			target.setOrgId(source.getOrgId());
			target.setDocumentContentType(source.getDocumentContentType());
			target.setDocument(source.getDocument());
			target.setDocumentType(source.getDocumentType().getCode());
			target.setUserId(source.getUserId());
			target.setFileName(source.getFileName());

			target.setEffectiveDate(source.getEffectiveDate() == null ? new Date() : source.getEffectiveDate());
			target.setDescription(source.getDescription());
			return target;
		}).collect(Collectors.toList());

		return targetList;
	}

	public List<UserDocumentResponseDTO> generateDTOForUserDocResponse(List<UserDocument> documents) {
		List<UserDocumentResponseDTO> targetList = documents.stream().map(source -> {
			UserDocumentResponseDTO target = new UserDocumentResponseDTO();
			target.setId(source.getId());
			target.setOrgId(source.getOrgId());
			target.setDocumentContentType(source.getDocumentContentType());
			target.setDocument(source.getDocument());
			target.setDocumentType(DocumentTypeEnum.parseEncodeValue(source.getDocumentType()));
			target.setFileName(source.getFileName());
			target.setDescription(source.getDescription());
			target.setEffectiveDate(source.getEffectiveDate());
			return target;
		}).collect(Collectors.toList());

		return targetList;
	}

}
