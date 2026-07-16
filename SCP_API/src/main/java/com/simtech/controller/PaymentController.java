package com.simtech.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;

import com.simtech.dto.PaymentHistoryDTO;
import com.simtech.dto.phonepe.PhonePeRequestDTO;
import com.simtech.dto.phonepe.PhonePeResponseDTO;
import com.simtech.response.StandardResponse;
import com.simtech.service.PaymentService;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/api/")
@CrossOrigin(maxAge = 3600, origins = { "*" }, methods = { RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.PUT,
		RequestMethod.DELETE, RequestMethod.POST })
public class PaymentController {
	@Autowired
	PaymentService paymentService;

	@PostMapping("public/payment")
	@ApiOperation(value = "This API is used to initiate Transaction")
	public StandardResponse<PhonePeResponseDTO> payment(HttpServletRequest request,
														@RequestBody PhonePeRequestDTO phonePeRequestDTO) {
		StandardResponse<PhonePeResponseDTO> response = new StandardResponse<PhonePeResponseDTO>();
		response.setResponseOK();
		response.setData(paymentService.payment(request, phonePeRequestDTO));
		return response;
	}

	@PostMapping("public/callback")
	public StandardResponse<PhonePeResponseDTO> handleCallback(@RequestBody String params) {
		StandardResponse<PhonePeResponseDTO> response = new StandardResponse<PhonePeResponseDTO>();
		Map<String, String> params1 = new HashMap<>();
		String[] pairs = params.split("&");
		for (String pair : pairs) {
			String[] keyValue = pair.split("=");
			params1.put(keyValue[0], keyValue[1]);
		}
		response.setData(paymentService.verifyChecksum(params1));
		response.setResponseOK();
		return response;
	}

	@GetMapping("user/getPaymentHistory")
	@ApiOperation(value = "This API is used to get payment history for logged in user")
	public StandardResponse<List<PaymentHistoryDTO>> getPaymentHistory(HttpServletRequest request) {
		StandardResponse<List<PaymentHistoryDTO>> response = new StandardResponse<List<PaymentHistoryDTO>>();
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		response.setResponseOK();
		response.setData(paymentService.getPaymentHistory(userId));
		return response;
	}

	@GetMapping("user/downloadInvoice/{paymentId}")
	@ApiOperation(value = "This API is used to download invoice for a payment")
	public ResponseEntity<byte[]> downloadInvoice(HttpServletRequest request, @PathVariable Long paymentId) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		byte[] pdfData = paymentService.generateInvoicePdf(userId, paymentId);
		
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_PDF);
		headers.setContentDispositionFormData("attachment", "TechCell_Invoice.pdf");
		
		return new ResponseEntity<>(pdfData, headers, HttpStatus.OK);
	}

	@PostMapping("user/emailInvoice/{paymentId}")
	@ApiOperation(value = "This API is used to email invoice for a payment")
	public StandardResponse<Boolean> emailInvoice(HttpServletRequest request, @PathVariable Long paymentId) {
		StandardResponse<Boolean> response = new StandardResponse<Boolean>();
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		paymentService.emailInvoice(userId, paymentId);
		response.setResponseOK();
		response.setData(true);
		return response;
	}
}
