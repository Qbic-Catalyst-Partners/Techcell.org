package com.simtech.service.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.simtech.dao.HashTagRepository;
import com.simtech.dao.OrgDetailRepository;
import com.simtech.dao.OrgProgramNameRepository;
import com.simtech.dao.ProgrameNameRepository;
import com.simtech.dao.ProgrameNameStremRepository;
import com.simtech.dao.StreamRepository;
import com.simtech.dao.UserRepository;
import com.simtech.dao.UserSigninRepository;
import com.simtech.dto.ProgramNameInput;
import com.simtech.dto.StreamInput;
import com.simtech.dto.UserCreateDTO;
import com.simtech.entity.HashTag;
import com.simtech.entity.OrgDetail;
import com.simtech.entity.OrgProgramRelationship;
import com.simtech.entity.ProgramName;
import com.simtech.entity.ProgramStreamRelationship;
import com.simtech.entity.Stream;
import com.simtech.entity.UserDetail;
import com.simtech.entity.UserSignin;
import com.simtech.exception.BusinessException;
import com.simtech.service.DataLoadService;
import com.simtech.service.helper.DataLoadFileParser;
import com.simtech.service.helper.UserServiceHelper;

@Service
public class DataLoadServiceImpl implements DataLoadService {

	@Autowired
	OrgDetailRepository orgDetailRepository;

	@Autowired
	ProgrameNameRepository programeNameRepository;
	@Autowired
	OrgProgramNameRepository orgProgramNameRepository;

	@Autowired
	StreamRepository streamRepository;
	@Autowired
	ProgrameNameStremRepository programeNameStremRepository;
	@Autowired
	HashTagRepository hashTagRepository;

	@Autowired
	DataLoadFileParser dataLoadFileParser;

	@Autowired
	UserSigninRepository userSigninRepository;

	@Autowired
	UserServiceHelper userServiceHelper;

	@Autowired
	UserRepository userRepository;

	@Transactional
	public void uploadOrgDetail(MultipartFile file) {
		List<OrgDetail> orgDetails = dataLoadFileParser.parseOrgFile(file);
		orgDetailRepository.saveAll(orgDetails);
	}

	@Override
	public void uploadStream(MultipartFile file) {
		List<StreamInput> streamInputs = dataLoadFileParser.parseStreamFile(file);
		for (StreamInput streamInput : streamInputs) {
			OrgDetail orgDetail = orgDetailRepository.findByAICTECode(streamInput.getAICTECode());
			if (orgDetail == null) {
				throw new BusinessException("invalidInput", "AICTE CODE", streamInput.getAICTECode());
			}

			ProgramName programName = programeNameRepository.findByProgramCode(streamInput.getProgramCode());
			if (programName == null) {
				throw new BusinessException("invalidInput", "Programename Code", streamInput.getProgramCode());
			}
			Stream stream = streamRepository.findBysreamCode(streamInput.getStreamCode());
			if (stream == null) {
				stream = new Stream();
				stream.setSreamCode(streamInput.getStreamCode());
				stream.setDescription(streamInput.getDescription());
				stream = streamRepository.save(stream);
			}
			ProgramStreamRelationship programStreamRelationship = new ProgramStreamRelationship();
			programStreamRelationship.setStream(stream);
			programStreamRelationship.setProgramName(programName);
			programStreamRelationship.setOrgDetail(orgDetail);
			programeNameStremRepository.save(programStreamRelationship);
		}

	}

	@Override
	public void uploadHashTag(MultipartFile file) {
		List<HashTag> streamInputs = dataLoadFileParser.parseHashTagFileFile(file);
		for (HashTag hashTag : streamInputs) {

			hashTagRepository.save(hashTag);
		}

	}

	@Override
	public void uploadProgrameName(MultipartFile file) {
		List<ProgramNameInput> programNames = dataLoadFileParser.parseProgrameNameFile(file);

		for (ProgramNameInput programNameInput : programNames) {
			OrgDetail orgDetail = orgDetailRepository.findByAICTECode(programNameInput.getAICTECode());
			if (orgDetail == null) {
				throw new BusinessException("invalidInput", "AICTE CODE", programNameInput.getAICTECode());
			}
			ProgramName programName = programeNameRepository.findByProgramCode(programNameInput.getProgramCode());
			if (programName == null) {
				programName = new ProgramName();
				programName.setDescription(programNameInput.getDescription());
				programName.setLevel(programNameInput.getLevel());
				programName.setProgramCode(programNameInput.getProgramCode());
				programName = programeNameRepository.save(programName);
			}
			OrgProgramRelationship orgStreamRelationship = new OrgProgramRelationship();
			orgStreamRelationship.setOrgDetail(orgDetail);
			orgStreamRelationship.setProgram(programName);
			orgProgramNameRepository.save(orgStreamRelationship);
		}
	}

	@Override
	public void uploadStudents(MultipartFile file) {
		List<UserCreateDTO> userCreateDTOs = dataLoadFileParser.parseUserDetailsFile(file);
		for (UserCreateDTO userCreateDTO : userCreateDTOs) {

			UserSignin existingRecord = userSigninRepository.findByUserName(userCreateDTO.getEmailId());
			if (existingRecord != null) {
				throw new BusinessException("Duplicateemail", userCreateDTO.getEmailId());
			}

			UserDetail userDetail = userServiceHelper.generateUserObjForCreate(userCreateDTO);
			userRepository.save(userDetail);
			UserSignin userSignins = userServiceHelper.generateUserSignIn(userDetail, userCreateDTO);
			userSigninRepository.save(userSignins);
		}

	}

}
