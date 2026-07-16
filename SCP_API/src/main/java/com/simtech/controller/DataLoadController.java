package com.simtech.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.simtech.response.BasicResponse;
import com.simtech.service.DataLoadService;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/api/")
@CrossOrigin(maxAge = 3600, origins = { "*" }, methods = { RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.PUT,
		RequestMethod.DELETE, RequestMethod.POST })
public class DataLoadController {
	@Autowired
	DataLoadService dataLoadService;

	@ApiOperation(value = "Upload file for New Org")
	@PostMapping("public/uploadOrgDetail")
	public BasicResponse uploadOrgDetail(@RequestParam MultipartFile file) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		dataLoadService.uploadOrgDetail(file);
		return response;

	}

	@ApiOperation(value = "Upload file for New Org")
	@PostMapping("public/uploadProgrameName")
	public BasicResponse uploadProgrameName(@RequestParam MultipartFile file) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		dataLoadService.uploadProgrameName(file);
		return response;

	}

	@ApiOperation(value = "Upload file for New Org")
	@PostMapping("public/uploadStream")
	public BasicResponse uploadStream(@RequestParam MultipartFile file) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		dataLoadService.uploadStream(file);
		return response;

	}

	@ApiOperation(value = "Upload file for New Org")
	@PostMapping("public/uploadHashTag")
	public BasicResponse uploadHashTag(@RequestParam MultipartFile file) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		dataLoadService.uploadHashTag(file);
		return response;

	}

	@ApiOperation(value = "Upload file for New uploadStudents")
	@PostMapping("public/uploadStudents")
	public BasicResponse uploadStudents(@RequestParam MultipartFile file) {
		BasicResponse response = new BasicResponse();
		response.setResponseOK();
		dataLoadService.uploadStudents(file);
		return response;

	}

}
