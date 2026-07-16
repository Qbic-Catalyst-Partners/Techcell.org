package com.simtech.dto.resume;

import com.fasterxml.jackson.annotation.JsonAlias;

public class ContactInfoDto {
    @JsonAlias({"mobileNumber"})
    public String mobile;
    @JsonAlias({"emailId"})
    public String email;
    @JsonAlias({"state"})
    public String location;

    // keep alternative fields as well for direct access if needed
    public String mobileNumber;
    public String emailId;
    public String state;
    @JsonAlias({"linkedIn"})
    public String linkedIn;
} 