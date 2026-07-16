package com.simtech.dto.constant;

public enum DataLoadFileTypeEnum {

	PROGRAMENAME("ProgrameName"), ORG("Org");

	String code = "";

	DataLoadFileTypeEnum(String code) {
		this.code = code;
	}

	public String getCode() {
		return code;
	}

	public static DataLoadFileTypeEnum parseEncodeValue(String Value) {
		DataLoadFileTypeEnum result = null;
		for (final DataLoadFileTypeEnum type : DataLoadFileTypeEnum.values()) {
			if (type.getCode().equals(Value)) {
				result = type;
				break;
			}
		}
		return result;
	}

}
