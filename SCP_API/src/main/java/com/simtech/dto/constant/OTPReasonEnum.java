package com.simtech.dto.constant;

public enum OTPReasonEnum {

	EMAIL("Email"), SMS("Sms");

	String code = "";

	OTPReasonEnum(String code) {
		this.code = code;
	}

	public String getCode() {
		return code;
	}

	public static OTPReasonEnum parseEncodeValue(String Value) {
		OTPReasonEnum result = null;
		for (final OTPReasonEnum type : OTPReasonEnum.values()) {
			if (type.getCode().equals(Value)) {
				result = type;
				break;
			}
		}
		return result;
	}

}
