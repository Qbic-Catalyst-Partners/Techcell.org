package com.simtech.dto.constant;

public enum ObjectStatus {

	PENDING_APPROVED("Pending Approved"), APPROVED("Approved"), REJECTED("Rejected");

	String code = "";

	ObjectStatus(String code) {
		this.code = code;
	}

	public String getCode() {
		return code;
	}

	public static ObjectStatus parseEncodeValue(String Value) {
		ObjectStatus result = null;
		for (final ObjectStatus type : ObjectStatus.values()) {
			if (type.getCode().equals(Value)) {
				result = type;
				break;
			}
		}
		return result;
	}

}
