package com.simtech.dto;

import java.util.List;

import com.simtech.entity.Stream;

public class OrgDetailResponseDTO {

	private Long orgId;
	private String orgName;
	private String contactNo;
	private String orgAddress;

	private String AICTECode;
	private String city;
	private String state;

	private List<Stream> streams;

	public Long getOrgId() {
		return orgId;
	}

	public void setOrgId(Long orgId) {
		this.orgId = orgId;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public String getContactNo() {
		return contactNo;
	}

	public void setContactNo(String contactNo) {
		this.contactNo = contactNo;
	}

	public String getOrgAddress() {
		return orgAddress;
	}

	public void setOrgAddress(String orgAddress) {
		this.orgAddress = orgAddress;
	}

	public String getAICTECode() {
		return AICTECode;
	}

	public void setAICTECode(String aICTECode) {
		AICTECode = aICTECode;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public List<Stream> getStreams() {
		return streams;
	}

	public void setStreams(List<Stream> streams) {
		this.streams = streams;
	}

}