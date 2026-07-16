package com.simtech.service;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.simtech.dto.phonepe.PhonePeRequestDTO;
import com.simtech.dto.phonepe.PhonePeResponseDTO;
import com.simtech.dto.razorpay.RazorpayRequestDTO;
import com.simtech.dto.razorpay.RazorpayResponseDTO;
import com.simtech.dto.PaymentHistoryDTO;

public interface PaymentService {

	PhonePeResponseDTO payment(HttpServletRequest request, PhonePeRequestDTO jobRequestDTO);

	PhonePeResponseDTO verifyChecksum(Map<String, String> params);

	List<PaymentHistoryDTO> getPaymentHistory(Long userId);

	// Add these methods to the interface
	byte[] generateInvoicePdf(Long userId, Long paymentId);
	void emailInvoice(Long userId, Long paymentId);

	RazorpayResponseDTO razorpayPayment(HttpServletRequest request, RazorpayRequestDTO razorpayRequestDTO);
	RazorpayResponseDTO verifyRazorpayPayment(String orderId, String paymentId, String signature);

}
