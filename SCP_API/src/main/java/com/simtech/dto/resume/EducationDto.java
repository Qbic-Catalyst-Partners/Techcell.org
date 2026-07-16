package com.simtech.dto.resume;

import com.fasterxml.jackson.annotation.JsonAlias;

public class EducationDto {
    @JsonAlias({"startDate"})
    public String startYear;
    @JsonAlias({"endDate"})
    public String endYear;
    @JsonAlias({"schoolName"})
    public String school;
    public String degree;
    @JsonAlias({"fieldOfStudy"})
    public String field;
    @JsonAlias({"grade"})
    public String gpa;
} 