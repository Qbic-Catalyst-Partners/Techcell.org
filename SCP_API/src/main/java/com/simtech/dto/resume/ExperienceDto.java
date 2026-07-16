package com.simtech.dto.resume;

import com.fasterxml.jackson.annotation.JsonAlias;

public class ExperienceDto {
    public String title;
    @JsonAlias({"companyName"})
    public String company;
    @JsonAlias({"startDate"})
    public String start;
    @JsonAlias({"endDate"})
    public String end;
    public String description;
} 