package com.simtech.service;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.json.JSONObject;
import org.springframework.web.util.UriComponentsBuilder;

//Make sure you add the below dependency in your pom.xml
//<dependency>
//<groupId>io.github.otpless-tech.auth</groupId>
//<artifactId>otpless-auth</artifactId>
//<version>1.0.8</version>
//</dependency>
// import com.otpless.authsdk.OTPAuth;
// import com.otpless.authsdk.OTPResponse;
// import com.otpless.authsdk.OTPVerificationResponse;
import com.simtech.dao.OTPLessRepository;
import com.simtech.dao.UserRepository;
import com.simtech.entity.OtpLess;
import com.simtech.entity.UserDetail;
import com.simtech.util.EncryptDecryptUtil;

@Service
@EnableAsync
public class SMSService {
	@Value("${otpless.App-ID}")
	private String appId;

	@Value("${otpless.Client-ID}")
	private String clientId;

	@Value("${otpless.Client-Secret}")
	private String clientSecreat;;

	@Value("${twofactor.api-key}")
	private String twoFactorApiKey;

	@Value("${twofactor.sender-id}")
	private String twoFactorSenderId;

	@Value("${twofactor.template-name}")
	private String twoFactorTemplateName;

	@Autowired
	OTPLessRepository otpLessRepository;
	@Autowired
	UserRepository userRepository;

	@Autowired
	EncryptDecryptUtil encryptDecryptUtil;

	public String sendotp(String mobileNo) {
		// --------- Begin OTPless implementation (commented out) ---------
		/*
			OTPAuth otpAuth = new OTPAuth(clientId, clientSecreat);

			OTPResponse otpResponse = otpAuth.sendOTP(null, mobileNo, null, null, 300, 6, "SMS");

			if (otpResponse.isSuccess()) {
				OtpLess otpLess = otpLessRepository.findByMobileNo(mobileNo);
				if (otpLess == null) {
					otpLess = new OtpLess();
				}
				otpLess.setMobileNo(mobileNo);
				otpLess.setOrderId(otpResponse.getOrderId());
				otpLessRepository.save(otpLess);
				return "OTP Sent successfully";
			} else {
				
				return otpResponse.getErrorMessage();
			}
		*/
		// --------- End OTPless implementation ---------

		// --------- Begin 2Factor implementation ---------
		RestTemplate restTemplate = new RestTemplate();
		String encodedTemplate;
		try {
		    encodedTemplate = java.net.URLEncoder.encode(twoFactorTemplateName, "UTF-8");
		} catch (java.io.UnsupportedEncodingException ex) {
		    encodedTemplate = twoFactorTemplateName; // fallback
		}
		String requestUrl = "https://2factor.in/API/V1/" + twoFactorApiKey + "/SMS/" + mobileNo.replace("+", "") + "/AUTOGEN/" + encodedTemplate;
		ResponseEntity<String> responseEntity = restTemplate.getForEntity(requestUrl, String.class);
		JSONObject json = new JSONObject(responseEntity.getBody());
		if ("Success".equalsIgnoreCase(json.optString("Status"))) {
			String sessionId = json.optString("Details");
			OtpLess otpLess = otpLessRepository.findByMobileNo(mobileNo);
			if (otpLess == null) {
				otpLess = new OtpLess();
			}
			otpLess.setMobileNo(mobileNo);
			otpLess.setOrderId(sessionId);
			otpLessRepository.save(otpLess);
			return "OTP Sent successfully";
		} else {
			return json.optString("Details");
		}
		// --------- End 2Factor implementation ---------
	}

	public String verifyOtp(String mobileNo, String otp) {
		// --------- Begin OTPless implementation (commented out) ---------
		/*
			OtpLess otpLess = otpLessRepository.findByMobileNo(mobileNo);
			OTPAuth otpAuth = new OTPAuth(clientId, clientSecreat);
			OTPVerificationResponse otpResponse = otpAuth.verifyOTP(otpLess.getOrderId(), otp, mobileNo, null);

			if (otpResponse.isSuccess()) {
				return otpResponse.getIsOTPVerified() ? "Otp Verified" : otpResponse.getReason();
			} else {
				
				return otpResponse.getErrorMessage();
			}
		*/
		OtpLess otpLess = otpLessRepository.findByMobileNo(mobileNo);
		if (otpLess == null) {
			return "OTP session not found";
		}
		RestTemplate restTemplate = new RestTemplate();
		String verifyUrl = "https://2factor.in/API/V1/" + twoFactorApiKey + "/SMS/VERIFY/" + otpLess.getOrderId() + "/" + otp;
		ResponseEntity<String> verifyResp = restTemplate.getForEntity(verifyUrl, String.class);
		JSONObject verifyJson = new JSONObject(verifyResp.getBody());
		if ("Success".equalsIgnoreCase(verifyJson.optString("Status"))) {
			return "Otp Verified";
		} else {
			return verifyJson.optString("Details");
		}
		// --------- End OTPless implementation ---------
	}

	public String resendOtp(String mobileNo) {
		// --------- Begin OTPless implementation (commented out) ---------
		/*
			OtpLess otpLess = otpLessRepository.findByMobileNo(mobileNo);
			OTPAuth otpAuth = new OTPAuth(clientId, clientSecreat);
			OTPResponse otpResponse = otpAuth.resendOTP(otpLess.getOrderId());

			if (otpResponse.isSuccess()) {
				return "OTP Sent successfully";
			} else {
				return otpResponse.getErrorMessage();
			}
		*/
		OtpLess otpLess = otpLessRepository.findByMobileNo(mobileNo);
		if (otpLess == null) {
			return "OTP session not found";
		}
		RestTemplate restTemplate = new RestTemplate();
		String resendUrl = "https://2factor.in/API/V1/" + twoFactorApiKey + "/SMS/" + otpLess.getOrderId() + "/RESEND";
		ResponseEntity<String> resendResp = restTemplate.getForEntity(resendUrl, String.class);
		JSONObject resendJson = new JSONObject(resendResp.getBody());
		if ("Success".equalsIgnoreCase(resendJson.optString("Status"))) {
			return "OTP Sent successfully";
		} else {
			return resendJson.optString("Details");
		}
		// --------- End OTPless implementation ---------
	}

	private String getMobileNo(HttpServletRequest request) {
		Long userId = Long.valueOf(request.getAttribute("userId").toString());
		UserDetail userDetail = userRepository.findByUserId(userId);
		return encryptDecryptUtil.decrypt(userDetail.getMobileNo());
	}

}
