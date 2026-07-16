package com.simtech.dto;

public class ProgramNameInput {

	private String AICTECode;

	private String programCode;

	private String description;

	private String level;

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getProgramCode() {
		return programCode;
	}

	public void setProgramCode(String programCode) {
		this.programCode = programCode;
	}

	public String getLevel() {
		return level;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public String getAICTECode() {
		return AICTECode;
	}

	public void setAICTECode(String aICTECode) {
		AICTECode = aICTECode;
	}

}
