package com.simtech.dto.resume;

import com.fasterxml.jackson.annotation.JsonAlias;

public class ProjectDto {
    @JsonAlias({"projectTitle"})
    public String title;
    @JsonAlias({"startDate"})
    public String start;
    @JsonAlias({"endDate"})
    public String end;
    public String description;
} 