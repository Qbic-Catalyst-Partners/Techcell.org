package com.simtech.controller;

import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.simtech.dto.razorpay.RazorpayRequestDTO;
import com.simtech.dto.razorpay.RazorpayResponseDTO;
import com.simtech.response.StandardResponse;
import com.simtech.service.PaymentService;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/api/")
@CrossOrigin(maxAge = 3600, origins = { "*" }, methods = { RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.PUT,
        RequestMethod.DELETE, RequestMethod.POST })
public class RazorpayController {

    @Autowired
    PaymentService paymentService;

    @PostMapping("public/razorpay/payment")
    @ApiOperation(value = "This API is used to initiate Razorpay payment")
    public StandardResponse<RazorpayResponseDTO> razorpayPayment(HttpServletRequest request,
                                                                 @RequestBody RazorpayRequestDTO razorpayRequestDTO) {
        StandardResponse<RazorpayResponseDTO> response = new StandardResponse<RazorpayResponseDTO>();
        response.setResponseOK();
        response.setData(paymentService.razorpayPayment(request, razorpayRequestDTO));
        return response;
    }

    @PostMapping("public/razorpay/verify")
    @ApiOperation(value = "This API is used to verify Razorpay payment")
    public StandardResponse<RazorpayResponseDTO> verifyRazorpayPayment(
            @RequestBody RazorpayPaymentVerificationRequest request) {
        StandardResponse<RazorpayResponseDTO> response = new StandardResponse<RazorpayResponseDTO>();
        response.setResponseOK();
        response.setData(paymentService.verifyRazorpayPayment(
                request.getOrderId(), request.getPaymentId(), request.getSignature()));
        return response;
    }
    // Helper class for verification request
    public static class RazorpayPaymentVerificationRequest {
        private String orderId;
        private String paymentId;
        private String signature;

        public String getOrderId() {
            return orderId;
        }

        public void setOrderId(String orderId) {
            this.orderId = orderId;
        }

        public String getPaymentId() {
            return paymentId;
        }

        public void setPaymentId(String paymentId) {
            this.paymentId = paymentId;
        }

        public String getSignature() {
            return signature;
        }

        public void setSignature(String signature) {
            this.signature = signature;
        }
    }
}