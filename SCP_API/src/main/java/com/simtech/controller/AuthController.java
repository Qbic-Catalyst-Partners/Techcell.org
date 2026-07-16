package com.simtech.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.simtech.response.StandardResponse;
import com.simtech.util.AuthTokenUtil;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/api/")
@CrossOrigin(maxAge = 3600, origins = { "*" }, methods = { RequestMethod.POST })
public class AuthController {

	@Autowired
	private AuthTokenUtil jwtTokenUtil;

	@PostMapping("public/refreshToken")
	@ApiOperation(value = "This API is used to refreshToken after Expiry")
	public StandardResponse<Map<String, String>> addToFavourite(@RequestBody String refreshToken) {
		StandardResponse<Map<String, String>> response = new StandardResponse<Map<String, String>>();
		response.setResponseOK();
		response.setData(jwtTokenUtil.refreshToken(refreshToken));
		return response;
	}
}