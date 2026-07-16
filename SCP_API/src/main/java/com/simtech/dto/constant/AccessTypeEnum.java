package com.simtech.dto.constant;

public enum AccessTypeEnum {

	ADDVIDEO("AddVideo"), LIKES("Likes");

	String code = "";

	AccessTypeEnum(String code) {
		this.code = code;
	}

	public String getCode() {
		return code;
	}

	public static AccessTypeEnum parseEncodeValue(String Value) {
		AccessTypeEnum result = null;
		for (final AccessTypeEnum type : AccessTypeEnum.values()) {
			if (type.getCode().equals(Value)) {
				result = type;
				break;
			}
		}
		return result;
	}

}
