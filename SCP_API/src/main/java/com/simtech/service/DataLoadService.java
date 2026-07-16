package com.simtech.service;

import org.springframework.web.multipart.MultipartFile;

public interface DataLoadService {

	public void uploadOrgDetail(MultipartFile file);

	public void uploadProgrameName(MultipartFile file);

	public void uploadStream(MultipartFile file);

	public void uploadStudents(MultipartFile file);

	public void uploadHashTag(MultipartFile file);

}
