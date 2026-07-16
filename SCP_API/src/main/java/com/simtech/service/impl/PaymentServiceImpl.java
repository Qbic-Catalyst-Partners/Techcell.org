package com.simtech.service.impl;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

import java.time.LocalDate;
import java.time.ZoneId;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.simtech.config.RazorpayConfig;
import com.simtech.dao.PaymentRepository;
import com.simtech.dao.UserRepository;
import com.simtech.dao.UserSigninRepository;
import com.simtech.dto.PaymentHistoryDTO;
import com.simtech.dto.phonepe.PhonePeRequestDTO;
import com.simtech.dto.phonepe.PhonePeResponseDTO;
import com.simtech.dto.razorpay.RazorpayRequestDTO;
import com.simtech.dto.razorpay.RazorpayResponseDTO;
import com.simtech.entity.Payment;
import com.simtech.entity.UserDetail;
import com.simtech.entity.UserSignin;
import com.simtech.exception.BusinessException;
import com.simtech.service.PaymentService;
import com.simtech.service.EmailService;
import com.simtech.service.EmailTemplateService;
import com.simtech.service.InvoiceService;
import com.simtech.service.PdfGenerationService;
import com.simtech.util.EncryptDecryptUtil;

@Service
public class PaymentServiceImpl implements PaymentService {
	@Autowired
	private WebClient.Builder webClientBuilder;

	@Autowired
	PaymentRepository paymentRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private EmailTemplateService emailTemplateService;

	@Autowired
	UserSigninRepository userSigninRepository;

	@Autowired
	EncryptDecryptUtil encryptDecryptUtil;

	@Autowired
	private RazorpayClient razorpayClient;

	@Autowired
	private RazorpayConfig razorpayConfig;

	@Autowired
	private EmailService emailService;

	@Autowired
	private PdfGenerationService pdfGenerationService;

	@Value("${razorpay.callback-url}")
	private String razorpayCallbackUrl;

	private static final String MERCHANTID = "PGTESTPAYUAT93";
	private static final String SECRET_KEY = "875126e4-5a13-4dae-ad60-5b8c8b629035";
	private static final int keyIndex = 1;

	private static final String REDIRECTURL = "http://43.205.31.73:8081/api/public/callback";

	@Override
	@Transactional
	public PhonePeResponseDTO payment(HttpServletRequest request, PhonePeRequestDTO requestDTO) {
		Payment payment = registerTransationInDB(request, requestDTO);
		return initiatePayment(requestDTO, payment);

	}

	private Payment registerTransationInDB(HttpServletRequest request, PhonePeRequestDTO requestDTO) {
		UserSignin existingRecord = userSigninRepository.findByUserName(requestDTO.getEmailId());
		if (existingRecord == null) {
			throw new BusinessException("invalidUserName");
		}
		Long userId = existingRecord.getUserDetail().getUserId();
		UserDetail userDetail = userRepository.findByUserId(userId);
		Payment payment = new Payment();
		payment.setAmount(requestDTO.getAmount());
		payment.setPurpose(requestDTO.getPurpose());
		payment.setStatus("payment_initiated");
		payment.setTractiondate(new Date());
		payment.setUpdateddate(new Date());
		payment.setUserDetail(userDetail);
		paymentRepository.save(payment);
		return payment;
	}

	private PhonePeResponseDTO initiatePayment(PhonePeRequestDTO requestDTO, Payment payment) throws JSONException {
		WebClient webClient = webClientBuilder.build();

		JSONObject jo = new JSONObject();
		jo.put("merchantId", MERCHANTID);
		jo.put("merchantTransactionId", String.valueOf(payment.getId()));
		jo.put("merchantUserId", String.valueOf(payment.getUserDetail().getUserId()));
		jo.put("name", payment.getUserDetail().getFirstName());
		jo.put("amount", requestDTO.getAmount());
		jo.put("redirectUrl", REDIRECTURL);
		jo.put("callbackUrl", REDIRECTURL);
		jo.put("redirectMode", "POST");
		jo.put("mobileNumber", encryptDecryptUtil.decrypt(payment.getUserDetail().getMobileNo()));
		JSONObject paymentInstrumentJO = new JSONObject();
		paymentInstrumentJO.put("type", "PAY_PAGE");
		jo.put("paymentInstrument", paymentInstrumentJO);

		String payloadMain = encodeToBase64(jo.toString());
//		payloadMain = "eyJtZXJjaGFudElkIjoiUEdURVNUUEFZVUFUOTMiLCJtZXJjaGFudFRyYW5zYWN0aW9uSWQiOiIxMjM0NTYiLCJtZXJjaGFudFVzZXJJZCI6Ik1VSUQxMjMiLCJuYW1lIjoic2FuamF5IiwiYW1vdW50IjoxMDAwMCwicmVkaXJlY3RVcmwiOiJodHRwOi8vbG9jYWxob3N0OjMwMDEvYXBpL3YxL3N0YXR1cy8xMjM0NTYiLCJyZWRpcmVjdE1vZGUiOiJQT1NUIiwibW9iaWxlTnVtYmVyIjoxMjM0NSwicGF5bWVudEluc3RydW1lbnQiOnsidHlwZSI6IlBBWV9QQUdFIn19";
		String string = payloadMain + "/pg/v1/pay" + SECRET_KEY;
		String sha256 = sha256Hex(string);
		String checksum = sha256 + "###" + keyIndex;
		String xverify = checksum;
		Map<String, String> bodyMap = new HashMap<String, String>();
		bodyMap.put("request", payloadMain);

		PhonePeResponseDTO result = webClient.post().uri("https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay")
				.header("X-VERIFY", xverify).header("Content-Type", "application/json")
				.body(BodyInserters.fromValue(bodyMap)).retrieve().bodyToMono(PhonePeResponseDTO.class).block(); // Use
		return result;
	}

	public static String encodeToBase64(String payload) {
		return Base64.getEncoder().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
	}

	public static String sha256Hex(String input) {
		// Create a SHA-256 MessageDigest instance
		MessageDigest digest;
		try {
			digest = MessageDigest.getInstance("SHA-256");
			byte[] encodedhash = digest.digest(input.getBytes());

			// Convert the byte array to a hex string
			return bytesToHex(encodedhash);
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		// Update the MessageDigest with the input string converted to bytes
		return null;
	}

	private static String bytesToHex(byte[] hash) {
		StringBuilder hexString = new StringBuilder();
		for (byte b : hash) {
			String hex = Integer.toHexString(0xff & b);
			if (hex.length() == 1)
				hexString.append('0');
			hexString.append(hex);
		}
		return hexString.toString();
	}

	@Override
	public PhonePeResponseDTO verifyChecksum(Map<String, String> params) {
		String transactionId = params.get("transactionId");
		String string = "/pg/v1/status/PGTESTPAYUAT93/" + transactionId + SECRET_KEY;
		String sha256 = sha256Hex(string);
		String checksum = sha256 + "###" + keyIndex;
		String uri = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/" + MERCHANTID + "/" + transactionId;
		WebClient webClient = webClientBuilder.build();
		try {
			PhonePeResponseDTO result = webClient.get().uri(uri).header("X-VERIFY", checksum)
					.header("Content-Type", "application/json").header("X-MERCHANT-ID", MERCHANTID).retrieve()
					.bodyToMono(PhonePeResponseDTO.class).block();
			Payment payment = paymentRepository.findById(Long.valueOf(transactionId)).get();
			payment.setStatus(result.getCode());
			payment.setUpdateddate(new Date());
			paymentRepository.save(payment);
			return result;
		} catch (Exception e) {
			throw new BusinessException("PaymentProcessingerror");
		}
	}

	@Override
	@Transactional
	public RazorpayResponseDTO razorpayPayment(HttpServletRequest request, RazorpayRequestDTO razorpayRequestDTO) {
		// Register transaction in database
		Payment payment = registerTransationInDB(request, razorpayRequestDTO);

		// Create Razorpay order
		return createRazorpayOrder(razorpayRequestDTO, payment);
	}

	private Payment registerTransationInDB(HttpServletRequest request, RazorpayRequestDTO razorpayRequestDTO) {
		UserSignin existingRecord = userSigninRepository.findByUserName(razorpayRequestDTO.getEmailId());
		if (existingRecord == null) {
			throw new BusinessException("invalidUserName");
		}

		Long userId = existingRecord.getUserDetail().getUserId();
		UserDetail userDetail = userRepository.findByUserId(userId);

		Payment payment = new Payment();
		payment.setAmount(razorpayRequestDTO.getAmount());
		payment.setPurpose(razorpayRequestDTO.getPurpose());
		payment.setStatus("payment_initiated");
		payment.setTractiondate(new Date());
		payment.setUpdateddate(new Date());
		payment.setUserDetail(userDetail);

		paymentRepository.save(payment);
		return payment;
	}

	private RazorpayResponseDTO createRazorpayOrder(RazorpayRequestDTO razorpayRequestDTO, Payment payment) {
		try {
			// Create Razorpay order
			JSONObject orderRequest = new JSONObject();
			orderRequest.put("amount", razorpayRequestDTO.getAmount() * 100); // Amount in paise
			orderRequest.put("currency", "INR");
			orderRequest.put("receipt", String.valueOf(payment.getId()));

			// Create order using Razorpay SDK
			Order order = razorpayClient.orders.create(orderRequest);
			String orderId = order.get("id");

			// Prepare response
			RazorpayResponseDTO response = new RazorpayResponseDTO();
			response.setSuccess(true);
			response.setOrderId(orderId);
			response.setAmount(razorpayRequestDTO.getAmount());

			// Set key_id for frontend
			response.setId(razorpayConfig.getKeyId());

			// Update payment with order ID
			payment.setStatus("order_created");
			paymentRepository.save(payment);

			return response;
		} catch (RazorpayException | JSONException e) {
			throw new BusinessException("RazorpayOrderCreationError", e.getMessage());
		}
	}

	@Override
	@Transactional
	public RazorpayResponseDTO verifyRazorpayPayment(String orderId, String paymentId, String signature) {
		try {
			// Verify the payment signature
			boolean isSignatureValid = validateRazorpaySignature(orderId, paymentId, signature);
			if (!isSignatureValid) {
				throw new BusinessException("InvalidRazorpaySignature", "Payment signature verification failed");
			}

			// Find payment by receipt (which is our payment ID)
			Order order = razorpayClient.orders.fetch(orderId);
			String receipt = order.get("receipt");
			Long paymentId_ = Long.valueOf(receipt);

			// Get the payment record by ID
			Payment payment = paymentRepository.findById(paymentId_)
					.orElseThrow(() -> new BusinessException("PaymentNotFound"));

			// Generate our custom invoice and transaction numbers
			payment.setInvoiceNumber(invoiceService.generateInvoiceNumber());
			payment.setAcademicInvoiceNumber(invoiceService.generateAcademicInvoiceNumber());
			payment.setTransactionReferenceNumber(invoiceService.generateTransactionReferenceNumber());
			
			// Store Razorpay details
			payment.setRazorpayOrderId(orderId);
			payment.setRazorpayPaymentId(paymentId);
			payment.setRazorpaySignature(signature);

			// Try to get payment method details from Razorpay
			try {
				// Fetch payment details from Razorpay
				com.razorpay.Payment razorpayPaymentDetails = razorpayClient.payments.fetch(paymentId);
				JSONObject paymentDetails = new JSONObject(razorpayPaymentDetails.toString());
				String method = paymentDetails.optString("method", "");
				// Extract additional payment method details if available
				JSONObject cardDetails = paymentDetails.optJSONObject("card");
				if (cardDetails != null) {
					String network = cardDetails.optString("network", "");
					String last4 = cardDetails.optString("last4", "");
					payment.setPaymentMethod(network + " Card XX" + last4);
				} else if (!method.isEmpty()) {
					payment.setPaymentMethod(method.toUpperCase());
				} else {
					payment.setPaymentMethod("Online Payment");
				}
			} catch (Exception e) {
				// If we can't get payment method details, use a default
				payment.setPaymentMethod("Online Payment");
			}

			// Update payment status
			payment.setStatus("payment_success");
			payment.setUpdateddate(new Date());
			paymentRepository.save(payment);

			// Update user's payment status using the UserDetail directly from the payment
			UserDetail userDetail = payment.getUserDetail();
			if (userDetail != null) {
				userDetail.setPaymentReceived(true);
				userRepository.save(userDetail);

				// Send welcome email with invoice for students
				sendWelcomeEmail(userDetail, payment, paymentId);
			} else {
				throw new BusinessException("UserDetailNotFound");
			}

			// Create response
			RazorpayResponseDTO response = new RazorpayResponseDTO();
			response.setSuccess(true);
			response.setStatus("payment_success");
			response.setOrderId(orderId);
			response.setPaymentId(paymentId);

			return response;
		} catch (RazorpayException e) {
			throw new BusinessException("RazorpayVerificationError", e.getMessage());
		}
	}

	private void sendWelcomeEmail(UserDetail userDetail, Payment payment, String paymentId) {
		try {
			String userName = userDetail.getFirstName() + " " + userDetail.getLastName();
			String userEmail = encryptDecryptUtil.decrypt(userDetail.getEmailId());
			String userPhone = encryptDecryptUtil.decrypt(userDetail.getMobileNo());
			String subject = "Welcome to TechCell!";
			
			// Get user's city and state from the database
			String userCity = userDetail.getCity();  // Assuming these fields exist in UserDetail
			String userState = userDetail.getState(); // Assuming these fields exist in UserDetail
			
			// Use default values if city or state is null
			if (userCity == null || userCity.isEmpty()) {
				userCity = "Bangalore";  // Default city
			}
			
			if (userState == null || userState.isEmpty()) {
				userState = "Karnataka";  // Default state
			}
			
			// Get HTML content from template service
			String htmlContent = emailTemplateService.prepareWelcomeEmail(
				userDetail.getFirstName(), 
				userDetail.getLastName(),
				userDetail.getRole().equals("Student")
			);
			
			if (userDetail.getRole().equals("Student")) {
				// Generate PDF with city and state from user details and use Razorpay payment ID
				byte[] pdfAttachment = pdfGenerationService.generatePaymentInvoice(
					userName, 
					userEmail, 
					payment.getAcademicInvoiceNumber(),   // Use academic invoice number
					payment.getRazorpayPaymentId(), // Use Razorpay payment ID
					payment.getAmount(),
					LocalDate.now(),
					userPhone,
					userCity,
					userState,
					payment.getPaymentMethod()
				);
				
				// Send email with attachment
				emailService.sendEmailWithAttachment(
					userEmail, 
					subject, 
					htmlContent, 
					pdfAttachment, 
					"TechCell_Invoice.pdf"
				);
			} else {
				// Send HTML email without attachment for non-students
				emailService.sendHtmlEmail(userEmail, subject, htmlContent);
			}
		} catch (Exception e) {
			e.printStackTrace();
			
		}
	}

	@Override
	public byte[] generateInvoicePdf(Long userId, Long paymentId) {
		// Find payment by ID and verify it belongs to the user
		Payment payment = paymentRepository.findById(paymentId)
			.orElseThrow(() -> new BusinessException("PaymentNotFound"));
		
		if (!payment.getUserDetail().getUserId().equals(userId)) {
			throw new BusinessException("UnauthorizedAccess");
		}
		
		UserDetail userDetail = payment.getUserDetail();
		String userName = userDetail.getFirstName() + " " + userDetail.getLastName();
		String userEmail = encryptDecryptUtil.decrypt(userDetail.getEmailId());
		String userPhone = encryptDecryptUtil.decrypt(userDetail.getMobileNo());
		
		// Get user's city and state
		String userCity = userDetail.getCity() != null && !userDetail.getCity().isEmpty() 
			? userDetail.getCity() : "Bangalore";
		String userState = userDetail.getState() != null && !userDetail.getState().isEmpty() 
			? userDetail.getState() : "Karnataka";
		
		// Convert transaction date to LocalDate
		LocalDate paymentDate = payment.getTractiondate().toInstant()
			.atZone(ZoneId.systemDefault())
			.toLocalDate();
		
		// Generate the PDF
		return pdfGenerationService.generatePaymentInvoice(
			userName, 
			userEmail, 
			payment.getInvoiceNumber(),
			payment.getTransactionReferenceNumber(),
			payment.getAmount(),
			paymentDate,
			userPhone,
			userCity,
			userState,
			payment.getPaymentMethod()
		);
	}

	@Override
	public void emailInvoice(Long userId, Long paymentId) {
		// Find payment by ID and verify it belongs to the user
		Payment payment = paymentRepository.findById(paymentId)
			.orElseThrow(() -> new BusinessException("PaymentNotFound"));
		
		if (!payment.getUserDetail().getUserId().equals(userId)) {
			throw new BusinessException("UnauthorizedAccess");
		}
		
		UserDetail userDetail = payment.getUserDetail();
		String userEmail = encryptDecryptUtil.decrypt(userDetail.getEmailId());
		
		// Generate the PDF
		byte[] pdfAttachment = generateInvoicePdf(userId, paymentId);
		
		// Send email with attachment
		String subject = "Your TechCell Invoice";
		String body = "<html><body>" +
					"<img src='cid:techcell-logo' alt='TechCell Logo' width='48'>" +
					"<h4 style='font-size:20px'>Dear " + userDetail.getFirstName() + ",</h4>" +
					"<p>Please find attached your invoice for the payment made on " + 
					new SimpleDateFormat("dd MMM yyyy").format(payment.getTractiondate()) + ".</p>" +
					"<p>Thank you for choosing TechCell!</p>" +
					"<p>Best regards,<br>The TechCell Team</p>" +
					"</body></html>";
		
		// Send email with attachment
		emailService.sendEmailWithAttachment(
			userEmail, 
			subject, 
			body, 
			pdfAttachment, 
			"TechCell_Invoice.pdf"
		);
	}

	@Override
	public List<PaymentHistoryDTO> getPaymentHistory(Long userId) {
		List<Payment> payments = paymentRepository.findByUserDetailUserIdAndStatusOrderByTractiondateDesc(userId, "payment_success");
		
		List<PaymentHistoryDTO> historyList = new ArrayList<>();
		for (Payment payment : payments) {
			PaymentHistoryDTO historyDTO = new PaymentHistoryDTO();
			historyDTO.setId(payment.getId());
			historyDTO.setTransactionDate(payment.getTractiondate());
			historyDTO.setAmount(payment.getAmount());
			historyDTO.setInvoiceNumber(payment.getInvoiceNumber());
			historyDTO.setAcademicInvoiceNumber(payment.getAcademicInvoiceNumber());
			historyDTO.setTransactionReferenceNumber(payment.getTransactionReferenceNumber());
			historyDTO.setPaymentMethod(payment.getPaymentMethod());
			historyDTO.setStatus(payment.getStatus());
			historyDTO.setRazorpayPaymentId(payment.getRazorpayPaymentId());
			
			historyList.add(historyDTO);
		}
		
		return historyList;
	}

	private boolean validateRazorpaySignature(String orderId, String paymentId, String razorpaySignature) {
		try {
			String payload = orderId + "|" + paymentId;
			String secret = razorpayConfig.getKeySecret(); // Use key secret, not key ID
			
			// Create a HMAC SHA-256 key
			javax.crypto.Mac hmac = javax.crypto.Mac.getInstance("HmacSHA256");
			javax.crypto.spec.SecretKeySpec keySpec = new javax.crypto.spec.SecretKeySpec(
				secret.getBytes(), "HmacSHA256");
			hmac.init(keySpec);
			
			// Generate signature
			byte[] hmacData = hmac.doFinal(payload.getBytes());
			String calculatedSignature = DatatypeConverter.printHexBinary(hmacData).toLowerCase();
			
			// Compare signatures
			return calculatedSignature.equals(razorpaySignature);
		} catch (Exception e) {
			throw new BusinessException("SignatureValidationError", e.getMessage());
		}
	}
}
