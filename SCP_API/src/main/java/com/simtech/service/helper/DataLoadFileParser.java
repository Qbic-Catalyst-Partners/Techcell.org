package com.simtech.service.helper;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.simtech.dao.ProgrameNameRepository;
import com.simtech.dto.ProgramNameInput;
import com.simtech.dto.StreamInput;
import com.simtech.dto.UserCreateDTO;
import com.simtech.entity.HashTag;
import com.simtech.entity.OrgDetail;
import com.simtech.util.FileParser;

@Component
public class DataLoadFileParser extends FileParser {

	@Autowired
	ProgrameNameRepository programeNameRepository;

	public List<OrgDetail> parseOrgFile(MultipartFile file) {
		List<OrgDetail> orgDetails = new ArrayList<OrgDetail>();
		try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
			org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0); // Assuming data is in the first sheet
			for (Row row : sheet) {
				// Skip the header row
				if (row.getRowNum() == 0) {
					continue;
				}
				OrgDetail orgDetail = new OrgDetail();
				orgDetail.setOrgName(getCellValue(row.getCell(0)));
				orgDetail.setAICTECode(getCellValue(row.getCell(1)));
				orgDetail.setState(getCellValue(row.getCell(2)));
				orgDetail.setCity(getCellValue(row.getCell(3)));
				orgDetail.setOrgAddress(getCellValue(row.getCell(4)));
				orgDetail.setContactNo(getCellValue(row.getCell(5)));
				orgDetails.add(orgDetail);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return orgDetails;
	}

	public List<ProgramNameInput> parseProgrameNameFile(MultipartFile file) {
		List<ProgramNameInput> programNames = new ArrayList<ProgramNameInput>();
		try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
			org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0); // Assuming data is in the first sheet
			for (Row row : sheet) {
				// Skip the header row
				if (row.getRowNum() == 0) {
					continue;
				}
				ProgramNameInput programName = new ProgramNameInput();
				programName.setAICTECode(getCellValue(row.getCell(0)));
				programName.setProgramCode(getCellValue(row.getCell(1)));
				programName.setDescription(getCellValue(row.getCell(2)));
				programName.setLevel(getCellValue(row.getCell(3)));
				programNames.add(programName);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return programNames;
	}

	public List<StreamInput> parseStreamFile(MultipartFile file) {

		List<StreamInput> streamInputs = new ArrayList<StreamInput>();
		try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
			org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0); // Assuming data is in the first sheet
			for (Row row : sheet) {
				// Skip the header row
				if (row.getRowNum() == 0) {
					continue;
				}
				StreamInput streamInput = new StreamInput();
				streamInput.setAICTECode(getCellValue(row.getCell(0)));
				streamInput.setProgramCode(getCellValue(row.getCell(1)));
				streamInput.setStreamCode(getCellValue(row.getCell(2)));
				streamInput.setDescription(getCellValue(row.getCell(3)));
				streamInputs.add(streamInput);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return streamInputs;
	}

	public List<HashTag> parseHashTagFileFile(MultipartFile file) {

		List<HashTag> hashTInputs = new ArrayList<HashTag>();
		try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
			org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0); // Assuming data is in the first sheet
			for (Row row : sheet) {
				// Skip the header row
				if (row.getRowNum() == 0) {
					continue;
				}
				HashTag hashTag = new HashTag();
				hashTag.setText(getCellValue(row.getCell(0)));
				hashTag.setDescription(getCellValue(row.getCell(1)));
				hashTInputs.add(hashTag);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return hashTInputs;
	}

	public List<UserCreateDTO> parseUserDetailsFile(MultipartFile file) {
		List<UserCreateDTO> userCreateDTOs = new ArrayList<UserCreateDTO>();
		try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
			org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0); // Assuming data is in the first sheet
			for (Row row : sheet) {
				// Skip the header row
				if (row.getRowNum() == 0) {
					continue;
				}
				if (getCellValue(row.getCell(0)) == null) {
					break;
				}
				UserCreateDTO userCreateDTO = new UserCreateDTO();
				userCreateDTO.setFirstName(getCellValue(row.getCell(0)));
				userCreateDTO.setLastName(getCellValue(row.getCell(1)));
				userCreateDTO.setPassword(getCellValue(row.getCell(2)));
				userCreateDTO.setEmailId(getCellValue(row.getCell(3)));
				userCreateDTO.setMobileNo(getCellValue(row.getCell(4)));
				userCreateDTO.setRole(getCellValue(row.getCell(5)));
				userCreateDTO.setGender(getCellValue(row.getCell(6)));
				userCreateDTO.setDob(getDateCellValue(row.getCell(7)));
				userCreateDTO.setEffectiveDate(new Date());
				userCreateDTO.setGraduationCompletiondate(getDateCellValue(row.getCell(8)));
				userCreateDTO.setStudentId(getCellValue(row.getCell(9)));
				userCreateDTO.setProgramName(getCellValue(row.getCell(10)));
				userCreateDTO.setCourseLevel(getCellValue(row.getCell(11)));
				userCreateDTO.setStream(getCellValue(row.getCell(12)));
				userCreateDTO.setQuestionId(Long.valueOf(8));
				userCreateDTO.setSecurityQuestionAns(getCellValue(row.getCell(13)));
				userCreateDTO.setOrgId(Long.valueOf(getCellValue(row.getCell(14))));
				userCreateDTO.setCity(getCellValue(row.getCell(15)));
				userCreateDTO.setState(getCellValue(row.getCell(16)));
				userCreateDTO.setDescription(getCellValue(row.getCell(17)));

				userCreateDTOs.add(userCreateDTO);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return userCreateDTOs;
	}

}
