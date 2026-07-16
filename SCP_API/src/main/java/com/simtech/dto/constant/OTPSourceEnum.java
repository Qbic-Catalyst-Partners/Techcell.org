package com.simtech.dto.constant;

public enum OTPSourceEnum {

	VERIFICATION("Verification"), SIGNIN("SignIn");

	String code = "";

	OTPSourceEnum(String code) {
		this.code = code;
	}

	public String getCode() {
		return code;
	}

	public static OTPSourceEnum parseEncodeValue(String Value) {
		OTPSourceEnum result = null;
		for (final OTPSourceEnum type : OTPSourceEnum.values()) {
			if (type.getCode().equals(Value)) {
				result = type;
				break;
			}
		}
		return result;
	}

}
