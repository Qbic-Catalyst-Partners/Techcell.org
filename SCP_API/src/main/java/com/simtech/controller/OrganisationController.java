package com.simtech.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.simtech.dto.OrgDetailResponseDTO;
import com.simtech.dto.UserDocumentRequestDTO;
import com.simtech.entity.HashTag;
import com.simtech.entity.ProgramName;
import com.simtech.entity.SecurityQuestion;
import com.simtech.entity.Stream;
import com.simtech.response.BasicResponse;
import com.simtech.response.StandardResponse;
import com.simtech.service.OrgService;
import com.simtech.service.PdfGenerationService;

import java.time.LocalDate;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import io.swagger.annotations.ApiOperation;



@RestController
@RequestMapping("/api/")
@CrossOrigin(maxAge = 3600, origins = { "*" }, methods = { RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.PUT,
		RequestMethod.DELETE, RequestMethod.POST })
public class OrganisationController {
	@Autowired
	OrgService orgService;

	@Autowired
private PdfGenerationService pdfGenerationService;

	@GetMapping("public/listOrgdetailByname")
	public StandardResponse<List<OrgDetailResponseDTO>> listOrgdetailByname(
			@RequestParam(name = "orgName", required = false) String orgName) {
		StandardResponse<List<OrgDetailResponseDTO>> response = new StandardResponse<List<OrgDetailResponseDTO>>();
		response.setResponseOK();
		response.setData(orgService.listOrgdetailByname(orgName));
		return response;
	}

	@GetMapping("public/listSecurityQuestions")
	public StandardResponse<List<SecurityQuestion>> listSecurityQuestions() {
		StandardResponse<List<SecurityQuestion>> response = new StandardResponse<List<SecurityQuestion>>();
		response.setResponseOK();
		response.setData(orgService.listSecurityQuestions());
		return response;
	}

	@GetMapping("public/invoicePreview")
	public ResponseEntity<byte[]> previewInvoice() {
		// Dummy values for invoice preview
		String userName = "Sample User";
		String emailId = "sample@example.com";
		String transactionId = "PREVIEW12345";
		double amount = 1000.00;
		LocalDate paymentDate = LocalDate.now();
		String phone = "9999999999";
		String city = "Bengaluru"; // Added this parameter
		String state = "Karnataka"; // Added this parameter
		
		byte[] pdf = pdfGenerationService.generatePaymentInvoice(
				userName,
				emailId,
				"INVOICE12345",
				transactionId,
				amount,
				paymentDate,
				phone,
				city,
				state,
				"Online Payment"
		);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_PDF);
		headers.add("Content-Disposition", "inline; filename=\"invoice_preview.pdf\"");

		return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
	}

	@GetMapping("org/getOrgByOrgId")
	public StandardResponse<OrgDetailResponseDTO> getOrgDetailByOrgId(
			@RequestParam(name = "orgId", required = false) Long orgId) {
		StandardResponse<OrgDetailResponseDTO> response = new StandardResponse<OrgDetailResponseDTO>();
		response.setResponseOK();
		response.setData(orgService.getOrgDetailById(orgId));
		return response;
	}

	@ApiOperation(value = "Upload documents")
	@PostMapping("org/uploadDocuments")
	public BasicResponse uploadDocument(@RequestBody List<UserDocumentRequestDTO> documentReqeDTOs) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		orgService.uploadDocuments(documentReqeDTOs);
		return response;

	}

	@ApiOperation(value = "Get HashTag List")
	@GetMapping("org/getHashTagList")
	public StandardResponse<List<HashTag>> getHashTagList(
			@RequestParam(name = "tagName", required = false) String tagName) {
		StandardResponse<List<HashTag>> response = new StandardResponse<List<HashTag>>();
		response.setResponseOK();
		response.setData(orgService.getHashTagList(tagName));
		return response;
	}

	@GetMapping("public/listProgramName")
	public StandardResponse<List<ProgramName>> listProgramName(
			@RequestParam(name = "orgId", required = false) Long orgId) {
		StandardResponse<List<ProgramName>> response = new StandardResponse<List<ProgramName>>();
		response.setResponseOK();
		response.setData(orgService.listProgramNameByOrgId(orgId));
		return response;
	}

	@GetMapping("public/listStream")
	public StandardResponse<List<Stream>> listStream(@RequestParam(name = "orgId", required = false) Long orgId,
			@RequestParam(name = "programId", required = false) Long programId) {
		StandardResponse<List<Stream>> response = new StandardResponse<List<Stream>>();
		response.setResponseOK();
		response.setData(orgService.listStream(orgId, programId));
		return response;
	}

	@GetMapping("public/getCounts")
	public StandardResponse<Map<String, Long>> getCounts() {
		StandardResponse<Map<String, Long>> response = new StandardResponse<Map<String, Long>>();
		response.setResponseOK();
		response.setData(orgService.getCounts());
		return response;
	}

	@GetMapping("public/getLatestPosting")
	public StandardResponse<Map<String, Object>> getLatestPosting() {
		StandardResponse<Map<String, Object>> response = new StandardResponse<Map<String, Object>>();
		response.setResponseOK();
		response.setData(orgService.getLatestPosting());
		return response;
	}
}